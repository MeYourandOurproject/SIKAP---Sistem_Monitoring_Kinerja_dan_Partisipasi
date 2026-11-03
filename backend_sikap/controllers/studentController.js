const { Op } = require("sequelize");
const ExcelJS = require("exceljs");
const { Class, Student, sequelize } = require("../models");

const genders = ["Male", "Female"];
const statuses = ["active", "inactive"];
const maxImportRows = 2000;
const maxReportedErrors = 20;
const gradeLevels = {
  X: "10",
  XI: "11",
  XII: "12",
};

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

async function refreshClassStudentCount(classId, transaction) {
  const totalStudent = await Student.count({
    where: { class_id: classId, status: "active" },
    transaction,
  });
  await Class.update(
    { total_student: totalStudent },
    { where: { id: classId }, transaction },
  );
}

function normalizeOptionalIdentifier(value) {
  if (value === undefined) return undefined;
  if (value === null || value.trim() === "") return null;
  return value.trim();
}

function getUpdatedIdentifier(value, currentValue) {
  return value === undefined ? currentValue : normalizeOptionalIdentifier(value);
}

function normalizeHeader(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getStudentColumn(header, aliases) {
  return header.findIndex((value) => aliases.includes(normalizeHeader(value)));
}

function getStudentColumns(header) {
  return {
    nis: getStudentColumn(header, ["nis"]),
    nisn: getStudentColumn(header, ["nisn"]),
    name: getStudentColumn(header, ["nama"]),
    gender: getStudentColumn(header, ["gender"]),
  };
}

function parseGender(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  if (["l", "laki-laki", "laki laki", "pria", "male"].includes(normalized)) {
    return "Male";
  }
  if (["p", "perempuan", "wanita", "female"].includes(normalized)) {
    return "Female";
  }
  return undefined;
}

async function readImportWorkbook(file) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file.buffer);
  return workbook;
}

function getWorksheetRows(worksheet) {
  const rows = [];
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    rows.push(
      Array.from({ length: worksheet.columnCount }, (_, index) =>
        row.getCell(index + 1).text.trim(),
      ),
    );
  });
  return rows;
}

function worksheetNameForClass(className) {
  return className.replace(/[\[\]:*?/\\]/g, " ").trim();
}

function normalizeSheetName(sheetName) {
  return String(sheetName).trim().toLocaleLowerCase("id-ID").replace(/\s+/g, " ");
}

function getGradeLevel(value) {
  return Object.prototype.hasOwnProperty.call(gradeLevels, value)
    ? gradeLevels[value]
    : null;
}

async function createStudentImportTemplate(classes) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SIKAP";
  workbook.subject = "Template impor data siswa semua kelas";
  workbook.created = new Date();

  const usedNames = new Set();
  for (const classRecord of classes) {
    const sheetName = worksheetNameForClass(classRecord.class_name);
    const normalizedName = normalizeSheetName(sheetName);
    if (!sheetName || sheetName.length > 31 || usedNames.has(normalizedName)) {
      throw new Error(
        `Nama kelas "${classRecord.class_name}" tidak dapat digunakan sebagai nama sheet Excel`,
      );
    }
    usedNames.add(normalizedName);

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = [
      { header: "nis", key: "nis", width: 18 },
      { header: "nisn", key: "nisn", width: 18 },
      { header: "nama", key: "nama", width: 32 },
      { header: "gender", key: "gender", width: 18 },
    ];
    worksheet.getRow(1).font = { bold: true };
    worksheet.getColumn("nis").numFmt = "@";
    worksheet.getColumn("nisn").numFmt = "@";
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    worksheet.autoFilter = "A1:D1";
  }

  return workbook.xlsx.writeBuffer();
}

function addImportError(errors, message) {
  if (errors.length < maxReportedErrors) errors.push(message);
  else errors.truncated = true;
}

class StudentController {
  static async downloadImportTemplate(req, res, next) {
    try {
      const grade = req.query.level;
      const level = getGradeLevel(grade);
      if (!level) {
        return res.status(400).json({ message: "Jenjang harus X, XI, atau XII" });
      }

      const classes = await Class.findAll({
        attributes: ["id", "class_name"],
        where: { level },
        order: [["class_name", "ASC"]],
      });
      if (classes.length === 0) {
        return res.status(400).json({ message: `Belum ada data kelas untuk jenjang ${grade}` });
      }

      const buffer = await createStudentImportTemplate(classes);
      res
        .set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        .set(
          "Content-Disposition",
          `attachment; filename="template-data-siswa-kelas-${grade.toLowerCase()}.xlsx"`,
        )
        .send(Buffer.from(buffer));
    } catch (error) {
      next(error);
    }
  }

  static async import(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Pilih file Excel .xlsx untuk diunggah" });
      }
      const grade = req.body.level;
      const level = getGradeLevel(grade);
      if (!level) {
        return res.status(400).json({ message: "Jenjang harus X, XI, atau XII" });
      }

      let workbook;
      try {
        workbook = await readImportWorkbook(req.file);
      } catch (error) {
        return res.status(400).json({ message: `File tidak dapat dibaca: ${error.message}` });
      }

      if (workbook.worksheets.length === 0) {
        return res.status(400).json({ message: "File Excel tidak memiliki sheet kelas" });
      }

      const classes = await Class.findAll({
        attributes: ["id", "class_name"],
        where: { level },
      });
      const classBySheetName = new Map();
      for (const classRecord of classes) {
        const sheetName = normalizeSheetName(worksheetNameForClass(classRecord.class_name));
        if (classBySheetName.has(sheetName)) {
          return res.status(400).json({
            message: "Nama kelas harus unik agar dapat dibedakan sebagai sheet Excel",
          });
        }
        classBySheetName.set(sheetName, classRecord);
      }

      const errors = [];
      const students = [];
      const seenNis = new Set();
      const seenNisn = new Set();
      const importedByClass = new Map();

      for (const worksheet of workbook.worksheets) {
        const rows = getWorksheetRows(worksheet);
        if (rows.every((row) => row.every((value) => !value))) continue;

        const classRecord = classBySheetName.get(normalizeSheetName(worksheet.name));
        if (!classRecord) {
          addImportError(
            errors,
            `Sheet "${worksheet.name}": nama sheet tidak cocok dengan nama kelas pada jenjang ${grade}. Unduh dan gunakan template kelas ${grade}.`,
          );
          continue;
        }

        const columns = getStudentColumns(rows[0] || []);
        if (Object.values(columns).some((column) => column === -1)) {
          addImportError(
            errors,
            `Sheet "${worksheet.name}": baris pertama harus berisi header nis, nisn, nama, gender. Unduh dan gunakan template kelas ${grade}.`,
          );
          continue;
        }

        importedByClass.set(classRecord.id, {
          id: classRecord.id,
          class_name: classRecord.class_name,
          importedCount: 0,
        });

        for (let index = 1; index < rows.length; index += 1) {
          const row = rows[index];
          if (row.every((value) => !String(value ?? "").trim())) continue;

          const line = index + 1;
          const location = `Sheet "${worksheet.name}", baris ${line}`;
          const name = String(row[columns.name] ?? "").trim();
          const nis = String(row[columns.nis] ?? "").trim() || null;
          const nisn = String(row[columns.nisn] ?? "").trim() || null;
          const gender = parseGender(String(row[columns.gender] ?? ""));

          if (!name) addImportError(errors, `${location}: nama wajib diisi`);
          if (name.length > 255) addImportError(errors, `${location}: nama maksimal 255 karakter`);
          if (nis && nis.length > 20) addImportError(errors, `${location}: NIS maksimal 20 karakter`);
          if (nisn && nisn.length > 20) addImportError(errors, `${location}: NISN maksimal 20 karakter`);
          if (gender === undefined) {
            addImportError(errors, `${location}: jenis kelamin harus L/P, laki-laki/perempuan, atau Male/Female`);
          }
          if (nis && seenNis.has(nis)) addImportError(errors, `${location}: NIS ${nis} duplikat di file`);
          if (nisn && seenNisn.has(nisn)) addImportError(errors, `${location}: NISN ${nisn} duplikat di file`);
          if (nis) seenNis.add(nis);
          if (nisn) seenNisn.add(nisn);

          students.push({
            nis,
            nisn,
            name,
            gender,
            class_id: classRecord.id,
            status: "active",
            row_number: line,
            sheet_name: worksheet.name,
          });
          importedByClass.get(classRecord.id).importedCount += 1;
        }
      }

      if (students.length === 0) {
        if (errors.length) {
          return res.status(400).json({
            message: "Impor dibatalkan. Perbaiki data berikut lalu unggah kembali.",
            errors,
            errorsTruncated: Boolean(errors.truncated),
          });
        }
        return res.status(400).json({ message: "Tidak ada data siswa pada sheet kelas" });
      }
      if (students.length > maxImportRows) {
        return res.status(400).json({
          message: `Maksimal ${maxImportRows} siswa dalam satu kali unggah`,
        });
      }

      const nisValues = [...seenNis];
      const nisnValues = [...seenNisn];
      const existingStudents =
        nisValues.length || nisnValues.length
          ? await Student.findAll({
              attributes: ["nis", "nisn"],
              where: {
                [Op.or]: [
                  ...(nisValues.length ? [{ nis: { [Op.in]: nisValues } }] : []),
                  ...(nisnValues.length ? [{ nisn: { [Op.in]: nisnValues } }] : []),
                ],
              },
            })
          : [];
      const existingNis = new Set(existingStudents.map((student) => student.nis).filter(Boolean));
      const existingNisn = new Set(existingStudents.map((student) => student.nisn).filter(Boolean));
      students.forEach((student) => {
        const location = `Sheet "${student.sheet_name}", baris ${student.row_number}`;
        if (student.nis && existingNis.has(student.nis)) {
          addImportError(errors, `${location}: NIS ${student.nis} sudah terdaftar`);
        }
        if (student.nisn && existingNisn.has(student.nisn)) {
          addImportError(errors, `${location}: NISN ${student.nisn} sudah terdaftar`);
        }
      });

      if (errors.length) {
        return res.status(400).json({
          message: "Impor dibatalkan. Perbaiki data berikut lalu unggah kembali.",
          errors,
          errorsTruncated: Boolean(errors.truncated),
        });
      }

      const createdStudents = await sequelize.transaction(async (transaction) => {
        const created = await Student.bulkCreate(
          students.map(({ row_number, sheet_name, ...student }) => student),
          { transaction, validate: true },
        );
        for (const importedClass of importedByClass.values()) {
          const totalStudents = await Student.count({
            where: { class_id: importedClass.id, status: "active" },
            transaction,
          });
          await Class.update(
            { total_student: totalStudents },
            { where: { id: importedClass.id }, transaction },
          );
          importedClass.total_student = totalStudents;
        }
        return created;
      });
      res.status(201).json({
        message: "Data siswa berhasil diimpor",
        level: grade,
        importedCount: createdStudents.length,
        classes: [...importedByClass.values()],
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Impor dibatalkan karena NIS atau NISN sudah terdaftar.",
        });
      }
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const where = {};
      if (req.query.class_id !== undefined) {
        if (!isPositiveInteger(req.query.class_id)) {
          return res.status(400).json({ message: "class_id must be a positive integer" });
        }
        where.class_id = Number(req.query.class_id);
      }

      if (req.query.status !== undefined) {
        if (!statuses.includes(req.query.status)) {
          return res.status(400).json({ message: "status must be active or inactive" });
        }
        where.status = req.query.status;
      }

      const students = await Student.findAll({
        where,
        include: [{ model: Class, as: "class", attributes: ["id", "class_name", "level", "major"] }],
        order: [["name", "ASC"]],
      });
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const student = await Student.findByPk(req.params.id, {
        include: [{ model: Class, as: "class", attributes: ["id", "class_name", "level", "major"] }],
      });
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { nis, nisn, name, gender, class_id, status = "active" } = req.body;
      if (typeof name !== "string" || !name.trim() || !isPositiveInteger(class_id)) {
        return res.status(400).json({ message: "name and a valid class_id are required" });
      }
      if (gender != null && !genders.includes(gender)) {
        return res.status(400).json({ message: "gender must be Male or Female" });
      }
      if (!statuses.includes(status)) {
        return res.status(400).json({ message: "status must be active or inactive" });
      }
      if (
        (nis != null && typeof nis !== "string") ||
        (nisn != null && typeof nisn !== "string")
      ) {
        return res.status(400).json({ message: "nis and nisn must be strings" });
      }

      const student = await sequelize.transaction(async (transaction) => {
        const createdStudent = await Student.create({
          nis: normalizeOptionalIdentifier(nis),
          nisn: normalizeOptionalIdentifier(nisn),
          name: name.trim(),
          gender: gender ?? null,
          class_id: Number(class_id),
          status,
        }, { transaction });
        await refreshClassStudentCount(createdStudent.class_id, transaction);
        return createdStudent;
      });
      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) return res.status(404).json({ message: "Student not found" });

      const { nis, nisn, name, gender, class_id, status } = req.body;
      if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        return res.status(400).json({ message: "name must not be empty" });
      }
      if (gender !== undefined && gender !== null && !genders.includes(gender)) {
        return res.status(400).json({ message: "gender must be Male or Female" });
      }
      if (class_id !== undefined && !isPositiveInteger(class_id)) {
        return res.status(400).json({ message: "class_id must be a positive integer" });
      }
      if (status !== undefined && !statuses.includes(status)) {
        return res.status(400).json({ message: "status must be active or inactive" });
      }
      if (
        (nis !== undefined && nis !== null && typeof nis !== "string") ||
        (nisn !== undefined && nisn !== null && typeof nisn !== "string")
      ) {
        return res.status(400).json({ message: "nis and nisn must be strings" });
      }

      const previousClassId = student.class_id;
      await sequelize.transaction(async (transaction) => {
        await student.update({
          nis: getUpdatedIdentifier(nis, student.nis),
          nisn: getUpdatedIdentifier(nisn, student.nisn),
          name: name === undefined ? student.name : name.trim(),
          gender: gender === undefined ? student.gender : gender,
          class_id: class_id === undefined ? student.class_id : Number(class_id),
          status: status === undefined ? student.status : status,
        }, { transaction });
        await refreshClassStudentCount(previousClassId, transaction);
        if (student.class_id !== previousClassId) {
          await refreshClassStudentCount(student.class_id, transaction);
        }
      });
      res.json(student);
    } catch (error) {
      next(error);
    }
  }

  static async remove(req, res, next) {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) return res.status(404).json({ message: "Student not found" });

      await sequelize.transaction(async (transaction) => {
        await student.update({ status: "inactive" }, { transaction });
        await refreshClassStudentCount(student.class_id, transaction);
      });
      res.json(student);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentController;
