// ========================================================================
// AUTOR:           Sánchez Lugo Eduardo Alejandro
// FECHA:           20/09/2026
// DB:              Sistema Académico
// MOTOR:           MongoDB 7.0+
// DESCRIPCIÓN:     Configuración inicial y limpieza de base de datos
// VERSIÓN:         1.0
// ========================================================================
// HISTORIAL:
// 20/09/2026      Versión inicial - Configuración base
// ========================================================================

print("\n" + "=".repeat(70));
print("SISTEMA ACADÉMICO - CONFIGURACIÓN INICIAL");
print("=".repeat(70) + "\n");

// ============================================
// CONFIGURACIÓN DE BASE DE DATOS
// ============================================

const DB_NAME = "academia_db";
const DB_VERSION = "1.0";
const DB_DESCRIPTION = "Sistema de Gestión Académica";

// Usar/crear la base de datos
use (DB_NAME);

print("Base de datos seleccionada: " + DB_NAME);
print("Versión: " + DB_VERSION);
print("Descripción: " + DB_DESCRIPTION + "\n");

// ============================================
// LIMPIEZA DE COLECCIONES EXISTENTES
// ============================================

print("⚠ LIMPIEZA DE DATOS EXISTENTES...\n");

const colecciones = [
    "calificaciones",
    "asistencias", 
    "pagos",
    "inscripciones",
    "cursos",
    "estudiantes",
    "profesores",
    "metadata"
];

let coleccionesEliminadas = 0;

colecciones.forEach(function(coleccion) {
    if (db.getCollectionNames().indexOf(coleccion) !== -1) {
        db[coleccion].drop();
        print("Colección '" + coleccion + "' eliminada");
        coleccionesEliminadas++;
    }
});

if (coleccionesEliminadas === 0) {
    print("No había colecciones previas para eliminar");
    } else {
    print("\n  Total colecciones eliminadas: " + coleccionesEliminadas);
    }

// ============================================
// CREAR COLECCIÓN DE METADATA
// ============================================

print("\nCreando colección de metadata...\n");

db.createCollection("metadata");

db.metadata.insertOne({
    _id: "database_info",
    nombre: DB_NAME,
    version: DB_VERSION,
    descripcion: DB_DESCRIPTION,
    fecha_creacion: new Date(),
    ultima_actualizacion: new Date(),
    autor: "Sánchez Lugo Eduardo Alejandro",
    motor: "MongoDB 7.0+",
    esquema_version: "1.0",
    colecciones: [
        "estudiantes",
        "profesores", 
        "cursos",
        "inscripciones",
        "calificaciones",
        "asistencias",
        "pagos"
    ],
    configuracion: {
        zona_horaria: "America/Mexico_City",
        moneda_predeterminada: "MXN",
        idioma_predeterminado: "es",
        pais: "México"
    }
});

print("Metadata de base de datos creada");
print("País: México");
print("Zona horaria: America/Mexico_City");
print("Moneda: MXN\n");

// ============================================
// VARIABLES GLOBALES DE AUDITORÍA
// ============================================

print("✓ Configuración de auditoría establecida\n");

const AUDIT_CONFIG = {
    campos_auditoria: [
        "created_at",    // Fecha de creación
        "updated_at",    // Fecha de actualización
        "created_by",    // Usuario que creó
        "updated_by"     // Usuario que actualizó
    ],
    usuario_sistema: ObjectId("000000000000000000000001"),
    descripcion: "Todos los documentos deben incluir campos de auditoría"
};

// Guardar configuración de auditoría
db.metadata.insertOne({
    _id: "audit_config",
    ...AUDIT_CONFIG,
    fecha_configuracion: new Date()
});

// ============================================
// CONFIGURACIÓN DE VALIDACIÓN GLOBAL
// ============================================

const VALIDATION_RULES = {
    email_pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    email_institucional_pattern: "^[a-zA-Z0-9._%+-]+@academia\\.edu\\.mx$",
    codigo_estudiante_pattern: "^EST-[0-9]{4}-[0-9]{3}$",
    codigo_profesor_pattern: "^PROF-[0-9]{4}-[0-9]{3}$",
    codigo_curso_pattern: "^[A-Z]{3,4}-[0-9]{3}$",
    numero_recibo_pattern: "^REC-[0-9]{4}-[0-9]{5}$",
    telefono_mexico_pattern: "^\\+?52?\\s?[0-9]{10}$",
    rfc_pattern: "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$",
    curp_pattern: "^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$"
};

db.metadata.insertOne({
    _id: "validation_rules",
    ...VALIDATION_RULES,
    descripcion: "Patrones de validación global (México)",
    fecha_configuracion: new Date()
});

print("Reglas de validación global configuradas (México)\n");

// ============================================
// ENUMERACIONES Y CATÁLOGOS
// ============================================

const CATALOGOS = {
    estados_estudiante: ["activo", "inactivo", "egresado", "retirado", "suspendido"],
    estados_profesor: ["activo", "inactivo", "licencia", "jubilado"],
    estados_curso: ["activo", "inactivo", "cancelado", "finalizado"],
    estados_inscripcion: ["inscrito", "aprobado", "reprobado", "retirado", "en_curso"],
    estados_calificacion: ["pendiente", "en_revision", "publicada", "impugnada"],
    estados_pago: ["pendiente", "pagado", "vencido", "cancelado", "reembolsado"],
    estados_asistencia: ["presente", "ausente", "tardanza", "justificado"],
    niveles_educativos: ["Primaria", "Secundaria", "Bachillerato", "Universidad", "Posgrado"],
    ciclos_academicos: ["Primer Semestre", "Segundo Semestre", "Verano", "Invierno"],
    tipos_documento: ["INE", "Pasaporte", "CURP", "Cedula Profesional"],
    generos: ["M", "F", "Otro"],
    turnos: ["Matutino", "Vespertino", "Nocturno", "Virtual"],
    tipos_pago: ["colegiatura", "inscripcion", "examen", "certificado", "multa", "otro"],
    metodos_pago: ["efectivo", "tarjeta", "transferencia", "cheque", "oxxo", "otro"],
    monedas: ["MXN", "USD"],
    dias_semana: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    estados_mexico: [
        "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
        "Chiapas", "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato",
        "Guerrero", "Hidalgo", "Jalisco", "México", "Michoacán", "Morelos",
        "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
        "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
        "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas", "Ciudad de México"
    ]
};

db.metadata.insertOne({
    _id: "catalogos",
    ...CATALOGOS,
    descripcion: "Catálogos y enumeraciones del sistema (México)",
    fecha_configuracion: new Date()
});

print("Catálogos del sistema configurados (México)\n");

// ============================================
// VALORES POR DEFECTO
// ============================================

const VALORES_DEFECTO = {
    estudiante: {
        estado: "activo",
        pais: "México",
        moneda: "MXN",
        creditos_iniciales: 0,
        promedio_inicial: 0
    },
    profesor: {
        estado: "activo",
        pais: "México",
        moneda_salario: "MXN"
    },
    curso: {
        estado: "activo",
        moneda: "MXN",
        estudiantes_inscritos: 0
    },
    inscripcion: {
        estado: "inscrito",
        moneda: "MXN",
        clases_totales: 0,
        asistencias: 0,
        faltas: 0,
        tardanzas: 0,
        porcentaje_asistencia: 0
    },
    calificacion: {
        estado: "pendiente",
        calificacion_maxima: 100
    },
    pago: {
        estado: "pendiente",
        moneda: "MXN",
        descuento: 0,
        recargo: 0
    }
    };

    db.metadata.insertOne({
    _id: "valores_defecto",
    ...VALORES_DEFECTO,
    descripcion: "Valores por defecto para nuevos registros",
    fecha_configuracion: new Date()
});

print("Valores por defecto configurados\n");

// ============================================
// RESUMEN DE CONFIGURACIÓN
// ============================================

print("=".repeat(70));
print("CONFIGURACIÓN COMPLETADA EXITOSAMENTE");
print("=".repeat(70));
print("\nBase de datos: " + DB_NAME);
print("País: México");
print("Moneda: MXN");
print("Zona horaria: America/Mexico_City");
print("Estado: Limpia y configurada");
print("Metadata creada: ✓");
print("Auditoría configurada: ✓");
print("Validaciones configuradas: ✓");
print("Catálogos configurados: ✓");
print("Valores por defecto: ✓");
print("\nSiguiente paso: Ejecutar 01_coleccion_estudiantes.mongodb.js\n");
