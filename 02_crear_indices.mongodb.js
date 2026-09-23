// ========================================================================
// AUTOR:           Sánchez Lugo Eduardo Alejandro
// FECHA:           22/09/2026
// DB:              Sistema Académico
// MOTOR:           MongoDB 7.0+
// DESCRIPCIÓN:     Creación de índices (IDEMPOTENTE: borra y recrea)
// VERSIÓN:         2.0
// ========================================================================
// Este script es IDEMPOTENTE: puedes ejecutarlo múltiples veces sin errores.
// Antes de crear los índices, borra todos los existentes (excepto _id)
// y los vuelve a crear desde cero.
// ========================================================================
// REGLAS DE NEGOCIO IMPLEMENTADAS:
// - RN-001: Códigos únicos para estudiantes, profesores, cursos, pagos
// - RN-002: Emails institucionales únicos
// - RN-003: No duplicar inscripciones (estudiante + curso + periodo)
// - RN-004: Documentos únicos por tipo (INE, CURP, Pasaporte)
// - RN-005: RFC único para profesores
// - RN-006: Un estudiante no puede tener dos pagos del mismo concepto en el mismo periodo
// ========================================================================

const DB_NAME = "academia_db";
use(DB_NAME);

print("\n" + "=".repeat(70));
print("CREACIÓN DE ÍNDICES - OPTIMIZACIÓN DE BASE DE DATOS");
print("=".repeat(70) + "\n");

let totalIndices = 0;
let inicioCreacion = new Date();

// ============================================
// LIMPIEZA PREVIA DE ÍNDICES (IDEMPOTENCIA)
// ============================================

print("LIMPIANDO ÍNDICES PREVIOS...\n");

const todasLasColecciones = [
    "estudiantes",
    "profesores",
    "cursos",
    "inscripciones",
    "calificaciones",
    "asistencias",
    "pagos"
];

todasLasColecciones.forEach(col => {
    if (!db.getCollectionNames().includes(col)) {
        print(`  ${col}: no existe, se omite limpieza`);
        return;
    }
    let indices = db[col].getIndexes();
    let borrados = 0;
    indices.forEach(idx => {
        if (idx.name === "_id_") return; // No se puede borrar el _id
        try {
            db[col].dropIndex(idx.name);
            borrados++;
        } catch (e) {
            print(`  Advertencia al borrar ${col}.${idx.name}: ${e.message}`);
        }
    });
    print(`  ${col}: ${borrados} índices previos eliminados`);
});

print("");
print("Creando nuevos índices...\n");

// ============================================
// 1. ÍNDICES PARA ESTUDIANTES
// ============================================

print("Creando índices para ESTUDIANTES...\n");

db.estudiantes.createIndex(
  { codigo_estudiante: 1 },
  { unique: true, name: "idx_codigo_estudiante_unique", background: true }
);
print("idx_codigo_estudiante_unique (UNIQUE)");
totalIndices++;

db.estudiantes.createIndex(
  { "documento.tipo": 1, "documento.numero": 1 },
  { unique: true, sparse: true, name: "idx_documento_unique", background: true }
);
print("idx_documento_unique (UNIQUE, SPARSE)");
totalIndices++;

db.estudiantes.createIndex(
  { "contacto.email_institucional": 1 },
  { unique: true, name: "idx_email_institucional_unique", background: true }
);
print("idx_email_institucional_unique (UNIQUE)");
totalIndices++;

db.estudiantes.createIndex(
  { "contacto.email_personal": 1 },
  { sparse: true, name: "idx_email_personal", background: true }
);
print("idx_email_personal (SPARSE)");
totalIndices++;

db.estudiantes.createIndex(
  { estado: 1 },
  { name: "idx_estado_estudiante", background: true }
);
print("idx_estado_estudiante");
totalIndices++;

db.estudiantes.createIndex(
  { nivel: 1, carrera: 1 },
  { name: "idx_nivel_carrera", background: true }
);
print("idx_nivel_carrera (COMPUESTO)");
totalIndices++;

db.estudiantes.createIndex(
  { nombre_completo: "text", "contacto.email_personal": "text" },
  {
    name: "idx_texto_busqueda_estudiante",
    weights: { nombre_completo: 10, "contacto.email_personal": 5 },
    default_language: "spanish"
  }
);
print("idx_texto_busqueda_estudiante (TEXT)");
totalIndices++;

db.estudiantes.createIndex(
  { created_at: -1 },
  { name: "idx_fecha_creacion_estudiante", background: true }
);
print("idx_fecha_creacion_estudiante (DESC)");
totalIndices++;

db.estudiantes.createIndex(
  { estado: 1, carrera: 1, semestre_actual: 1 },
  {
    name: "idx_estado_carrera_semestre",
    background: true,
    partialFilterExpression: { estado: "activo" }
  }
);
print("idx_estado_carrera_semestre (COMPUESTO, PARCIAL)");
totalIndices++;

db.estudiantes.createIndex(
  { "direccion.estado": 1, "direccion.ciudad": 1 },
  { name: "idx_estado_ciudad", background: true, sparse: true }
);
print("idx_estado_ciudad (COMPUESTO, SPARSE)");
totalIndices++;

db.estudiantes.createIndex(
  { turno: 1, estado: 1 },
  { name: "idx_turno_estado", background: true }
);
print("idx_turno_estado");
totalIndices++;

// INDICE NUEVO: por estado para consultar historial_estado
db.estudiantes.createIndex(
  { "historial_estado.fecha_cambio": -1 },
  { name: "idx_historial_estado_est", background: true, sparse: true }
);
print("idx_historial_estado_est (SPARSE)");
totalIndices++;

print("\nTotal índices estudiantes: 12\n");

// ============================================
// 2. ÍNDICES PARA PROFESORES
// ============================================

print("Creando índices para PROFESORES...\n");

db.profesores.createIndex(
  { codigo_profesor: 1 },
  { unique: true, name: "idx_codigo_profesor_unique", background: true }
);
print("idx_codigo_profesor_unique (UNIQUE)");
totalIndices++;

db.profesores.createIndex(
  { "contacto.email_institucional": 1 },
  { unique: true, name: "idx_email_profesor_unique", background: true }
);
print("idx_email_profesor_unique (UNIQUE)");
totalIndices++;

db.profesores.createIndex(
  { rfc: 1 },
  { unique: true, sparse: true, name: "idx_rfc_unique", background: true }
);
print("idx_rfc_unique (UNIQUE, SPARSE)");
totalIndices++;

db.profesores.createIndex(
  { "documento.tipo": 1, "documento.numero": 1 },
  { unique: true, sparse: true, name: "idx_documento_profesor_unique", background: true }
);
print("idx_documento_profesor_unique (UNIQUE, SPARSE)");
totalIndices++;

db.profesores.createIndex(
  { especialidad: 1 },
  { name: "idx_especialidad", background: true }
);
print("idx_especialidad");
totalIndices++;

db.profesores.createIndex(
  { estado: 1 },
  { name: "idx_estado_profesor", background: true }
);
print("idx_estado_profesor");
totalIndices++;

db.profesores.createIndex(
  { nombre_completo: "text", especialidad: "text", "subespecialidades": "text" },
  {
    name: "idx_texto_profesor",
    weights: { nombre_completo: 10, especialidad: 8, subespecialidades: 5 },
    default_language: "spanish"
  }
);
print("idx_texto_profesor (TEXT)");
totalIndices++;

db.profesores.createIndex(
  { estado: 1, "estadisticas.cursos_impartiendo": -1 },
  {
    name: "idx_estado_cursos",
    background: true,
    partialFilterExpression: { estado: "activo" }
  }
);
print("idx_estado_cursos (COMPUESTO, PARCIAL)");
totalIndices++;

db.profesores.createIndex(
  { tipo_contrato: 1, estado: 1 },
  { name: "idx_tipo_contrato", background: true }
);
print("idx_tipo_contrato");
totalIndices++;

db.profesores.createIndex(
  { experiencia_años: -1 },
  { name: "idx_experiencia", background: true }
);
print("idx_experiencia (DESC)");
totalIndices++;

// INDICE NUEVO: historial_estado de profesores
db.profesores.createIndex(
  { "historial_estado.fecha_cambio": -1 },
  { name: "idx_historial_estado_prof", background: true, sparse: true }
);
print("idx_historial_estado_prof (SPARSE)");
totalIndices++;

print("\nTotal índices profesores: 11\n");

// ============================================
// 3. ÍNDICES PARA CURSOS
// ============================================

print("Creando índices para CURSOS...\n");

db.cursos.createIndex(
  { codigo_curso: 1 },
  { unique: true, name: "idx_codigo_curso_unique", background: true }
);
print("idx_codigo_curso_unique (UNIQUE)");
totalIndices++;

db.cursos.createIndex(
  { profesor_id: 1 },
  { name: "idx_profesor_id", background: true }
);
print("idx_profesor_id (FK)");
totalIndices++;

db.cursos.createIndex(
  { nivel: 1, carrera: 1, semestre: 1 },
  { name: "idx_nivel_carrera_semestre_curso", background: true }
);
print("idx_nivel_carrera_semestre_curso (COMPUESTO)");
totalIndices++;

db.cursos.createIndex(
  { estado: 1 },
  { name: "idx_estado_curso", background: true }
);
print("idx_estado_curso");
totalIndices++;

db.cursos.createIndex(
  { "periodo.año": 1, "periodo.ciclo": 1 },
  { name: "idx_periodo_academico", background: true }
);
print("idx_periodo_academico (COMPUESTO)");
totalIndices++;

db.cursos.createIndex(
  { nombre: "text", descripcion: "text", codigo_curso: "text" },
  {
    name: "idx_texto_curso",
    weights: { nombre: 10, codigo_curso: 8, descripcion: 3 },
    default_language: "spanish"
  }
);
print("idx_texto_curso (TEXT)");
totalIndices++;

db.cursos.createIndex(
  { estado: 1, estudiantes_inscritos: 1, capacidad_maxima: 1 },
  {
    name: "idx_cupo_disponible",
    background: true,
    partialFilterExpression: { estado: "activo" }
  }
);
print("idx_cupo_disponible (COMPUESTO, PARCIAL)");
totalIndices++;

db.cursos.createIndex(
  { estado: 1, "periodo.año": 1, "periodo.ciclo": 1 },
  { name: "idx_cursos_activos_periodo", background: true }
);
print("idx_cursos_activos_periodo (COMPUESTO)");
totalIndices++;

db.cursos.createIndex(
  { creditos: 1 },
  { name: "idx_creditos", background: true }
);
print("idx_creditos");
totalIndices++;

db.cursos.createIndex(
  { nivel: 1, estado: 1, "periodo.año": 1, estudiantes_inscritos: 1 },
  { name: "idx_busqueda_avanzada_curso", background: true }
);
print("idx_busqueda_avanzada_curso (COMPUESTO)");
totalIndices++;

print("\nTotal índices cursos: 10\n");

// ============================================
// 4. ÍNDICES PARA INSCRIPCIONES
// ============================================

print("Creando índices para INSCRIPCIONES...\n");

db.inscripciones.createIndex(
  { estudiante_id: 1, curso_id: 1, "periodo.año": 1, "periodo.ciclo": 1 },
  { unique: true, name: "idx_inscripcion_unica", background: true }
);
print("idx_inscripcion_unica (UNIQUE, COMPUESTO)");
totalIndices++;

db.inscripciones.createIndex(
  { estudiante_id: 1, estado: 1 },
  { name: "idx_estudiante_estado_insc", background: true }
);
print("idx_estudiante_estado_insc (COMPUESTO)");
totalIndices++;

db.inscripciones.createIndex(
  { curso_id: 1, estado: 1 },
  { name: "idx_curso_estado_insc", background: true }
);
print("idx_curso_estado_insc (COMPUESTO)");
totalIndices++;

db.inscripciones.createIndex(
  { "periodo.año": 1, "periodo.ciclo": 1 },
  { name: "idx_periodo_inscripcion", background: true }
);
print("idx_periodo_inscripcion (COMPUESTO)");
totalIndices++;

db.inscripciones.createIndex(
  { created_at: -1 },
  { name: "idx_fecha_inscripcion", background: true }
);
print("idx_fecha_inscripcion (DESC)");
totalIndices++;

db.inscripciones.createIndex(
  { estado: 1, calificacion_final: -1 },
  {
    name: "idx_estado_calificacion_final",
    background: true,
    partialFilterExpression: { estado: { $in: ["aprobado", "reprobado"] } }
  }
);
print("idx_estado_calificacion_final (COMPUESTO, PARCIAL)");
totalIndices++;

db.inscripciones.createIndex(
  { estudiante_codigo: 1 },
  { name: "idx_estudiante_codigo_insc", background: true }
);
print("idx_estudiante_codigo_insc");
totalIndices++;

db.inscripciones.createIndex(
  { curso_codigo: 1 },
  { name: "idx_curso_codigo_insc", background: true }
);
print("idx_curso_codigo_insc");
totalIndices++;

db.inscripciones.createIndex(
  { pago_realizado: 1, estado: 1 },
  {
    name: "idx_pago_realizado",
    background: true,
    partialFilterExpression: { pago_realizado: false }
  }
);
print("idx_pago_realizado (PARCIAL)");
totalIndices++;

db.inscripciones.createIndex(
  { estudiante_id: 1, "periodo.año": 1, calificacion_final: -1 },
  { name: "idx_kardex", background: true }
);
print("idx_kardex (COMPUESTO)");
totalIndices++;

print("\nTotal índices inscripciones: 10\n");

// ============================================
// 5. ÍNDICES PARA CALIFICACIONES
// ============================================

print("Creando índices para CALIFICACIONES...\n");

db.calificaciones.createIndex(
  { inscripcion_id: 1 },
  { name: "idx_inscripcion_calif", background: true }
);
print("idx_inscripcion_calif (FK)");
totalIndices++;

db.calificaciones.createIndex(
  { estudiante_id: 1, curso_id: 1 },
  { name: "idx_estudiante_curso_calif", background: true }
);
print("idx_estudiante_curso_calif (COMPUESTO)");
totalIndices++;

db.calificaciones.createIndex(
  { curso_id: 1, tipo_evaluacion: 1 },
  { name: "idx_curso_tipo_evaluacion", background: true }
);
print("idx_curso_tipo_evaluacion (COMPUESTO)");
totalIndices++;

db.calificaciones.createIndex(
  { estado: 1 },
  { name: "idx_estado_calificacion", background: true }
);
print("idx_estado_calificacion");
totalIndices++;

db.calificaciones.createIndex(
  { fecha_evaluacion: -1 },
  { name: "idx_fecha_evaluacion", background: true }
);
print("idx_fecha_evaluacion (DESC)");
totalIndices++;

db.calificaciones.createIndex(
  { registrado_por: 1 },
  { name: "idx_registrado_por", background: true }
);
print("idx_registrado_por");
totalIndices++;

db.calificaciones.createIndex(
  { curso_id: 1, estado: 1, calificacion_obtenida: -1 },
  {
    name: "idx_curso_estado_nota",
    background: true,
    partialFilterExpression: { estado: "publicada" }
  }
);
print("idx_curso_estado_nota (COMPUESTO, PARCIAL)");
totalIndices++;

db.calificaciones.createIndex(
  { estudiante_id: 1, fecha_evaluacion: -1 },
  { name: "idx_historial_calificaciones", background: true }
);
print("idx_historial_calificaciones (COMPUESTO)");
totalIndices++;

db.calificaciones.createIndex(
  { created_at: -1 },
  { name: "idx_fecha_registro_calif", background: true }
);
print("idx_fecha_registro_calif (DESC)");
totalIndices++;

print("\nTotal índices calificaciones: 9\n");

// ============================================
// 6. ÍNDICES PARA ASISTENCIAS
// ============================================

print("Creando índices para ASISTENCIAS...\n");

db.asistencias.createIndex(
  { curso_id: 1, fecha_clase: -1 },
  { name: "idx_curso_fecha_asistencia", background: true }
);
print("idx_curso_fecha_asistencia (COMPUESTO, DESC)");
totalIndices++;

db.asistencias.createIndex(
  { "asistencias.estudiante_id": 1 },
  { name: "idx_estudiante_asistencia", background: true }
);
print("idx_estudiante_asistencia (ARRAY)");
totalIndices++;

db.asistencias.createIndex(
  { fecha_clase: -1 },
  { name: "idx_fecha_clase", background: true }
);
print("idx_fecha_clase (DESC)");
totalIndices++;

db.asistencias.createIndex(
  { profesor_id: 1, fecha_clase: -1 },
  { name: "idx_profesor_asistencia", background: true }
);
print("idx_profesor_asistencia (COMPUESTO)");
totalIndices++;

db.asistencias.createIndex(
  { "asistencias.estado": 1 },
  { name: "idx_estado_asistencia_array", background: true }
);
print("idx_estado_asistencia_array (ARRAY)");
totalIndices++;

db.asistencias.createIndex(
  { curso_id: 1, fecha_clase: -1, "resumen.porcentaje_asistencia": -1 },
  { name: "idx_reporte_asistencia", background: true }
);
print("idx_reporte_asistencia (COMPUESTO)");
totalIndices++;

db.asistencias.createIndex(
  { "asistencias.estudiante_codigo": 1 },
  { name: "idx_codigo_estudiante_asist", background: true }
);
print("idx_codigo_estudiante_asist (ARRAY)");
totalIndices++;

print("\nTotal índices asistencias: 7\n");

// ============================================
// 7. ÍNDICES PARA PAGOS
// ============================================

print("Creando índices para PAGOS...\n");

db.pagos.createIndex(
  { numero_recibo: 1 },
  { unique: true, name: "idx_numero_recibo_unique", background: true }
);
print("idx_numero_recibo_unique (UNIQUE)");
totalIndices++;

db.pagos.createIndex(
  { estudiante_id: 1, created_at: -1 },
  { name: "idx_estudiante_fecha_pago", background: true }
);
print("idx_estudiante_fecha_pago (COMPUESTO, DESC)");
totalIndices++;

db.pagos.createIndex(
  { estado: 1 },
  { name: "idx_estado_pago", background: true }
);
print("idx_estado_pago");
totalIndices++;

db.pagos.createIndex(
  { fecha_vencimiento: 1, estado: 1 },
  { name: "idx_fecha_vencimiento", background: true }
);
print("idx_fecha_vencimiento (COMPUESTO)");
totalIndices++;

db.pagos.createIndex(
  { "periodo.año": 1, "periodo.mes": 1 },
  { name: "idx_periodo_pago", background: true, sparse: true }
);
print("idx_periodo_pago (COMPUESTO, SPARSE)");
totalIndices++;

db.pagos.createIndex(
  { tipo: 1, estado: 1 },
  { name: "idx_tipo_pago", background: true }
);
print("idx_tipo_pago (COMPUESTO)");
totalIndices++;

db.pagos.createIndex(
  { created_at: -1 },
  { name: "idx_fecha_creacion_pago", background: true }
);
print("idx_fecha_creacion_pago (DESC)");
totalIndices++;

db.pagos.createIndex(
  { estado: 1, fecha_vencimiento: 1 },
  {
    name: "idx_pagos_vencidos",
    background: true,
    partialFilterExpression: { estado: { $in: ["pendiente", "vencido"] } }
  }
);
print("idx_pagos_vencidos (COMPUESTO, PARCIAL)");
totalIndices++;

db.pagos.createIndex(
  { estado: 1, "periodo.año": 1, "periodo.mes": 1, total: -1 },
  {
    name: "idx_reporte_ingresos",
    background: true,
    partialFilterExpression: { estado: "pagado" }
  }
);
print("idx_reporte_ingresos (COMPUESTO, PARCIAL)");
totalIndices++;

db.pagos.createIndex(
  { estudiante_id: 1, tipo: 1, "periodo.año": 1, "periodo.mes": 1 },
  { name: "idx_pago_concepto_periodo", background: true, sparse: true }
);
print("idx_pago_concepto_periodo (COMPUESTO, SPARSE)");
totalIndices++;

db.pagos.createIndex(
  { "factura.rfc": 1 },
  { name: "idx_rfc_factura", background: true, sparse: true }
);
print("idx_rfc_factura (SPARSE)");
totalIndices++;

db.pagos.createIndex(
  { "factura.uuid": 1 },
  { name: "idx_uuid_factura", background: true, sparse: true, unique: true }
);
print("idx_uuid_factura (UNIQUE, SPARSE)");
totalIndices++;

db.pagos.createIndex(
  { metodo_pago: 1, estado: 1 },
  { name: "idx_metodo_pago", background: true }
);
print("idx_metodo_pago (COMPUESTO)");
totalIndices++;

db.pagos.createIndex(
  { estudiante_codigo: 1 },
  { name: "idx_estudiante_codigo_pago", background: true }
);
print("idx_estudiante_codigo_pago");
totalIndices++;

print("\nTotal índices pagos: 14\n");

// ============================================
// ACTUALIZAR METADATA
// ============================================

db.metadata.updateOne(
  { _id: "database_info" },
  {
    $set: {
      ultima_actualizacion: new Date(),
      indices_creados: totalIndices,
      estado: "Índices creados y optimizados"
    }
  }
);

// ============================================
// RESUMEN FINAL
// ============================================

let finCreacion = new Date();
let tiempoCreacion = (finCreacion - inicioCreacion) / 1000;

print("=".repeat(70));
print("RESUMEN DE OPTIMIZACIÓN");
print("=".repeat(70));
print(`Tiempo de creación: ${tiempoCreacion.toFixed(2)} segundos`);
print(`Total de índices creados: ${totalIndices}`);
print("");
print("REGLAS DE NEGOCIO IMPLEMENTADAS:");
print("  RN-001: Códigos únicos (estudiante, profesor, curso, recibo)");
print("  RN-002: Emails institucionales únicos (@academia.edu.mx)");
print("  RN-003: No duplicar inscripciones (estudiante + curso + periodo)");
print("  RN-004: Documentos únicos (INE, CURP, Pasaporte)");
print("  RN-005: RFC único para profesores");
print("  RN-006: No duplicar pagos de colegiatura/inscripción por periodo");
print("");
print("NUEVOS ÍNDICES PARA HISTORIAL DE ESTADOS:");
print("  - idx_historial_estado_est  (estudiantes)");
print("  - idx_historial_estado_prof (profesores)");
print("");
print("SIGUIENTE PASO:");
print("Ejecutar: 03_datos_prueba.mongodb.js");
print("=".repeat(70) + "\n");