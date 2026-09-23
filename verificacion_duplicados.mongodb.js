const DB_NAME = "academia_db";
use(DB_NAME);


print("=== VERIFICACION FINAL DE INTEGRIDAD ===\n");

// 1. Duplicados en inscripciones (RN-003)
let dupInsc = db.inscripciones.aggregate([
    { $group: { _id: { est: "$estudiante_id", cur: "$curso_id", año: "$periodo.año", ciclo: "$periodo.ciclo" }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
]).toArray();
print(`1. Duplicados en inscripciones (RN-003): ${dupInsc.length} (esperado: 0)`);

// 2. Estudiantes con menos de 5 inscripciones
let estIncompletos = db.inscripciones.aggregate([
    { $group: { _id: "$estudiante_id", total: { $sum: 1 } } },
    { $match: { total: { $ne: 5 } } }
]).toArray();
print(`2. Estudiantes con != 5 inscripciones: ${estIncompletos.length} (esperado: 0)`);

// 3. Calificaciones huerfanas (sin inscripcion valida)
let califHuerfanas = db.calificaciones.aggregate([
    {
        $lookup: {
            from: "inscripciones",
            localField: "inscripcion_id",
            foreignField: "_id",
            as: "insc"
        }
    },
    { $match: { "insc.0": { $exists: false } } },
    { $count: "total" }
]).toArray();
print(`3. Calificaciones sin inscripcion valida: ${califHuerfanas.length > 0 ? califHuerfanas[0].total : 0} (esperado: 0)`);

// 4. Pagos huerfanos (sin estudiante valido)
let pagosHuerfanos = db.pagos.aggregate([
    {
        $lookup: {
            from: "estudiantes",
            localField: "estudiante_id",
            foreignField: "_id",
            as: "est"
        }
    },
    { $match: { "est.0": { $exists: false } } },
    { $count: "total" }
]).toArray();
print(`4. Pagos sin estudiante valido: ${pagosHuerfanos.length > 0 ? pagosHuerfanos[0].total : 0} (esperado: 0)`);

// 5. Estudiantes/profesores inactivos sin historial_estado
let sinHistorialEst = db.estudiantes.countDocuments({
    estado: { $ne: "activo" },
    $or: [
        { historial_estado: { $exists: false } },
        { historial_estado: { $size: 0 } }
    ]
});
print(`5. Estudiantes no-activos sin historial_estado: ${sinHistorialEst} (esperado: 0)`);

let sinHistorialProf = db.profesores.countDocuments({
    estado: { $ne: "activo" },
    $or: [
        { historial_estado: { $exists: false } },
        { historial_estado: { $size: 0 } }
    ]
});
print(`6. Profesores no-activos sin historial_estado: ${sinHistorialProf} (esperado: 0)`);

// 6. Total de calificaciones por inscripcion
let califPorInsc = db.calificaciones.aggregate([
    { $group: { _id: "$inscripcion_id", total: { $sum: 1 } } },
    { $match: { total: { $ne: 4 } } },
    { $count: "total" }
]).toArray();
print(`7. Inscripciones con != 4 calificaciones: ${califPorInsc.length > 0 ? califPorInsc[0].total : 0} (esperado: 0)`);

print("\n=== FIN DE VERIFICACION ===");