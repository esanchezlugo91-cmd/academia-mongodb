//========================================================================
// AUTOR:           Sánchez Lugo Eduardo Alejandro
// FECHA:           21/09/2026
// DB:              Sistema Académico
// MOTOR:           MongoDB 7.0+
// DESCRIPCIÓN:     Creación de colecciones con validación de esquemas
// VERSIÓN:         1.0
// ========================================================================
// HISTORIAL:
// 2024-01-26      Versión inicial - Creación de 7 colecciones principales
// ========================================================================
// NOTA: No se usa 'default' en $jsonSchema porque no está soportado en MongoDB
//       Los valores por defecto se aplican en la capa de aplicación
// ========================================================================

const DB_NAME = "academia_db";

use (DB_NAME);

print("\n" + "=".repeat(70));
print("CREACIÓN DE COLECCIONES CON VALIDACIÓN");
print("=".repeat(70) + "\n");

// Variable global para auditoría
const USER_ADMIN = ObjectId("000000000000000000000001");

// ============================================
// 1. COLECCIÓN: ESTUDIANTES
// ============================================

print("Creando colección: ESTUDIANTES...");

db.createCollection("estudiantes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "codigo_estudiante",
        "nombres", 
        "apellidos",
        "nombre_completo",
        "contacto",
        "nivel",
        "estado",
        "created_at",
        "created_by"
      ],
      properties: {
        codigo_estudiante: {
          bsonType: "string",
          pattern: "^EST-[0-9]{4}-[0-9]{3}$",
          description: "REQUERIDO: Código único del estudiante (EST-YYYY-NNN)"
        },
        nombres: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "REQUERIDO: Nombres del estudiante (2-100 caracteres)"
        },
        apellidos: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "REQUERIDO: Apellidos del estudiante (2-100 caracteres)"
        },
        nombre_completo: {
          bsonType: "string",
          description: "REQUERIDO: Nombre completo para búsquedas rápidas"
        },
        documento: {
          bsonType: "object",
          required: ["tipo", "numero"],
          properties: {
            tipo: {
              enum: ["INE", "Pasaporte", "CURP", "Cedula Profesional"],
              description: "REQUERIDO: Tipo de documento de identidad"
            },
            numero: {
              bsonType: "string",
              minLength: 5,
              maxLength: 25,
              description: "REQUERIDO: Número de documento (5-25 caracteres)"
            }
          },
          description: "Documento de identidad del estudiante"
        },
        fecha_nacimiento: {
          bsonType: "date",
          description: "Fecha de nacimiento del estudiante"
        },
        edad: {
          bsonType: "int",
          minimum: 15,
          maximum: 100,
          description: "Edad del estudiante (15-100 años)"
        },
        genero: {
          enum: ["M", "F", "Otro"],
          description: "Género del estudiante"
        },
        contacto: {
          bsonType: "object",
          required: ["email_institucional"],
          properties: {
            email_personal: {
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
              description: "Email personal con formato válido"
            },
            email_institucional: {
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@academia\\.edu\\.mx$",
              description: "REQUERIDO: Email institucional (@academia.edu.mx)"
            },
            telefono: {
              bsonType: "string",
              description: "Teléfono de contacto (10 dígitos)"
            },
            telefono_emergencia: {
              bsonType: "string",
              description: "Teléfono de emergencia"
            }
          },
          description: "REQUERIDO: Información de contacto"
        },
        direccion: {
          bsonType: "object",
          properties: {
            calle: { bsonType: "string" },
            numero: { bsonType: "string" },
            colonia: { bsonType: "string" },
            ciudad: { bsonType: "string" },
            estado: { bsonType: "string" },
            codigo_postal: { 
              bsonType: "string",
              pattern: "^[0-9]{5}$",
              description: "Código postal de 5 dígitos"
            },
            pais: { bsonType: "string" }
          },
          description: "Dirección física del estudiante"
        },
        tutor: {
          bsonType: "object",
          properties: {
            nombre_completo: { bsonType: "string" },
            parentesco: { bsonType: "string" },
            telefono: { bsonType: "string" },
            email: { bsonType: "string" }
          },
          description: "Información del tutor o representante legal"
        },
        nivel: {
          enum: ["Primaria", "Secundaria", "Bachillerato", "Universidad", "Posgrado"],
          description: "REQUERIDO: Nivel educativo del estudiante"
        },
        carrera: {
          bsonType: "string",
          description: "Carrera o especialidad que cursa"
        },
        semestre_actual: {
          bsonType: "int",
          minimum: 1,
          maximum: 12,
          description: "Semestre actual (1-12)"
        },
        turno: {
          enum: ["Matutino", "Vespertino", "Nocturno", "Virtual"],
          description: "Turno de clases del estudiante"
        },
        estado: {
          enum: ["activo", "inactivo", "egresado", "retirado", "suspendido"],
          description: "REQUERIDO: Estado actual del estudiante"
        },
        fecha_ingreso: {
          bsonType: "date",
          description: "Fecha de ingreso a la institución"
        },
        fecha_egreso: {
          bsonType: ["date", "null"],
          description: "Fecha de egreso (null si aún estudia)"
        },
        estadisticas: {
          bsonType: "object",
          properties: {
            cursos_inscritos: { bsonType: "int", minimum: 0 },
            cursos_aprobados: { bsonType: "int", minimum: 0 },
            cursos_reprobados: { bsonType: "int", minimum: 0 },
            promedio_general: { bsonType: "double", minimum: 0, maximum: 100 },
            total_faltas: { bsonType: "int", minimum: 0 },
            creditos_acumulados: { bsonType: "int", minimum: 0 }
          },
          description: "Estadísticas académicas del estudiante (desnormalizado)"
        },
        documentos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              tipo: { bsonType: "string" },
              url: { bsonType: "string" },
              fecha_subida: { bsonType: "date" }
            }
          },
          description: "Documentos adjuntos del estudiante"
        },
        observaciones: {
          bsonType: "string",
          description: "Observaciones o notas adicionales"
        },
        
        // === CAMPOS DE AUDITORÍA ===
        created_at: {
          bsonType: "date",
          description: "REQUERIDO: Fecha de creación del registro"
        },
        updated_at: {
          bsonType: "date",
          description: "Fecha de última actualización"
        },
        created_by: {
          bsonType: "objectId",
          description: "REQUERIDO: Usuario que creó el registro"
        },
        updated_by: {
          bsonType: "objectId",
          description: "Usuario que realizó la última actualización"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'estudiantes' creada con validación estricta\n");

// ============================================
// 2. COLECCIÓN: PROFESORES
// ============================================

print("Creando colección: PROFESORES...");

db.createCollection("profesores", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "codigo_profesor",
        "nombres",
        "apellidos",
        "nombre_completo",
        "contacto",
        "especialidad",
        "estado",
        "created_at",
        "created_by"
      ],
      properties: {
        codigo_profesor: {
          bsonType: "string",
          pattern: "^PROF-[0-9]{4}-[0-9]{3}$",
          description: "REQUERIDO: Código único del profesor (PROF-YYYY-NNN)"
        },
        nombres: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "REQUERIDO: Nombres del profesor"
        },
        apellidos: {
          bsonType: "string",
          minLength: 2,
          maxLength: 100,
          description: "REQUERIDO: Apellidos del profesor"
        },
        nombre_completo: {
          bsonType: "string",
          description: "REQUERIDO: Nombre completo para búsquedas"
        },
        documento: {
          bsonType: "object",
          properties: {
            tipo: { enum: ["INE", "Pasaporte", "CURP", "Cedula Profesional"] },
            numero: { bsonType: "string" }
          }
        },
        rfc: {
          bsonType: "string",
          pattern: "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$",
          description: "RFC con homoclave"
        },
        fecha_nacimiento: {
          bsonType: "date"
        },
        genero: {
          enum: ["M", "F", "Otro"]
        },
        contacto: {
          bsonType: "object",
          required: ["email_institucional"],
          properties: {
            email_personal: { bsonType: "string" },
            email_institucional: {
              bsonType: "string",
              pattern: "^[a-zA-Z0-9._%+-]+@academia\\.edu\\.mx$",
              description: "REQUERIDO: Email institucional"
            },
            telefono: { bsonType: "string" },
            linkedin: { bsonType: "string" }
          },
          description: "REQUERIDO: Información de contacto"
        },
        direccion: {
          bsonType: "object",
          properties: {
            calle: { bsonType: "string" },
            numero: { bsonType: "string" },
            colonia: { bsonType: "string" },
            ciudad: { bsonType: "string" },
            estado: { bsonType: "string" },
            codigo_postal: { bsonType: "string" },
            pais: { bsonType: "string" }
          }
        },
        especialidad: {
          bsonType: "string",
          description: "REQUERIDO: Especialidad principal del profesor"
        },
        subespecialidades: {
          bsonType: "array",
          items: { bsonType: "string" },
          description: "Subespecialidades del profesor"
        },
        formacion_academica: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              nivel: { enum: ["Licenciatura", "Maestría", "Doctorado", "Posdoctorado"] },
              titulo: { bsonType: "string" },
              institucion: { bsonType: "string" },
              año_obtencion: { bsonType: "int", minimum: 1950, maximum: 2030 }
            }
          },
          description: "Formación académica del profesor"
        },
        experiencia_años: {
          bsonType: "int",
          minimum: 0,
          maximum: 60,
          description: "Años de experiencia docente"
        },
        horarios_disponibles: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              dia: { enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
              hora_inicio: { bsonType: "string" },
              hora_fin: { bsonType: "string" }
            }
          }
        },
        tipo_contrato: {
          enum: ["Tiempo completo", "Medio tiempo", "Por horas", "Contratado"]
        },
        fecha_contratacion: {
          bsonType: "date"
        },
        salario: {
          bsonType: "object",
          properties: {
            monto: { bsonType: "double", minimum: 0 },
            moneda: { enum: ["MXN", "USD"] },
            periodo: { enum: ["mensual", "quincenal", "semanal", "por hora"] }
          }
        },
        estado: {
          enum: ["activo", "inactivo", "licencia", "jubilado"],
          description: "REQUERIDO: Estado actual del profesor"
        },
        estadisticas: {
          bsonType: "object",
          properties: {
            cursos_impartiendo: { bsonType: "int", minimum: 0 },
            total_estudiantes: { bsonType: "int", minimum: 0 },
            años_en_institucion: { bsonType: "int", minimum: 0 },
            calificacion_promedio: { bsonType: "double", minimum: 0, maximum: 5 }
          }
        },
        documentos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              tipo: { bsonType: "string" },
              url: { bsonType: "string" },
              fecha_subida: { bsonType: "date" }
            }
          }
        },
        
        // === CAMPOS DE AUDITORÍA ===
        created_at: {
          bsonType: "date",
          description: "REQUERIDO: Fecha de creación"
        },
        updated_at: {
          bsonType: "date"
        },
        created_by: {
          bsonType: "objectId",
          description: "REQUERIDO: Usuario creador"
        },
        updated_by: {
          bsonType: "objectId"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'profesores' creada con validación estricta\n");

// ============================================
// 3. COLECCIÓN: CURSOS
// ============================================

print("Creando colección: CURSOS...");

db.createCollection("cursos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "codigo_curso",
        "nombre",
        "nivel",
        "estado",
        "created_at",
        "created_by"
      ],
      properties: {
        codigo_curso: {
          bsonType: "string",
          pattern: "^[A-Z]{3,4}-[0-9]{3}$",
          description: "REQUERIDO: Código del curso (Ej: MAT-101)"
        },
        nombre: {
          bsonType: "string",
          minLength: 3,
          maxLength: 200,
          description: "REQUERIDO: Nombre del curso"
        },
        descripcion: {
          bsonType: "string"
        },
        nivel: {
          enum: ["Primaria", "Secundaria", "Bachillerato", "Universidad", "Posgrado"],
          description: "REQUERIDO: Nivel educativo"
        },
        carrera: {
          bsonType: "string"
        },
        semestre: {
          bsonType: "int",
          minimum: 1,
          maximum: 12
        },
        creditos: {
          bsonType: "int",
          minimum: 1,
          maximum: 10,
          description: "Créditos académicos del curso"
        },
        profesor_id: {
          bsonType: "objectId",
          description: "Referencia al profesor que imparte el curso"
        },
        profesor_nombre: {
          bsonType: "string",
          description: "Snapshot del nombre del profesor (desnormalizado)"
        },
        horario: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              dia: { enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] },
              hora_inicio: { bsonType: "string" },
              hora_fin: { bsonType: "string" },
              aula: { bsonType: "string" }
            }
          }
        },
        capacidad_maxima: {
          bsonType: "int",
          minimum: 1,
          maximum: 200,
          description: "Capacidad máxima de estudiantes"
        },
        estudiantes_inscritos: {
          bsonType: "int",
          minimum: 0,
          description: "Contador de estudiantes inscritos (desnormalizado)"
        },
        periodo: {
          bsonType: "object",
          properties: {
            año: { bsonType: "int", minimum: 2020, maximum: 2050 },
            ciclo: { enum: ["Primer Semestre", "Segundo Semestre", "Verano", "Invierno"] },
            fecha_inicio: { bsonType: "date" },
            fecha_fin: { bsonType: "date" }
          }
        },
        syllabus: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              unidad: { bsonType: "int" },
              tema: { bsonType: "string" },
              subtemas: { bsonType: "array" },
              horas: { bsonType: "int" }
            }
          },
          description: "Programa del curso"
        },
        sistema_evaluacion: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["tipo", "porcentaje"],
            properties: {
              tipo: { bsonType: "string" },
              porcentaje: { bsonType: "int", minimum: 0, maximum: 100 },
              fecha: { bsonType: ["date", "null"] }
            }
          },
          description: "Sistema de evaluación del curso"
        },
        recursos: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              tipo: { bsonType: "string" },
              titulo: { bsonType: "string" },
              url: { bsonType: "string" }
            }
          }
        },
        prerrequisitos: {
          bsonType: "array",
          items: { bsonType: "objectId" },
          description: "IDs de cursos prerrequisitos"
        },
        estado: {
          enum: ["activo", "inactivo", "cancelado", "finalizado"],
          description: "REQUERIDO: Estado del curso"
        },
        estadisticas: {
          bsonType: "object",
          properties: {
            promedio_calificaciones: { bsonType: "double" },
            tasa_aprobacion: { bsonType: "double" },
            asistencia_promedio: { bsonType: "double" }
          }
        },
        
        // === CAMPOS DE AUDITORÍA ===
        created_at: {
          bsonType: "date",
          description: "REQUERIDO: Fecha de creación"
        },
        updated_at: {
          bsonType: "date"
        },
        created_by: {
          bsonType: "objectId",
          description: "REQUERIDO: Usuario creador"
        },
        updated_by: {
          bsonType: "objectId"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'cursos' creada con validación estricta\n");

// ============================================
// 4. COLECCIÓN: INSCRIPCIONES
// ============================================

print("Creando colección: INSCRIPCIONES...");

db.createCollection("inscripciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "estudiante_id",
        "curso_id",
        "periodo",
        "estado",
        "fecha_inscripcion",
        "created_at",
        "created_by"
      ],
      properties: {
        estudiante_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia al estudiante (FK a estudiantes._id)"
        },
        curso_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia al curso (FK a cursos._id)"
        },
        estudiante_codigo: {
          bsonType: "string"
        },
        estudiante_nombre: {
          bsonType: "string"
        },
        curso_codigo: {
          bsonType: "string"
        },
        curso_nombre: {
          bsonType: "string"
        },
        fecha_inscripcion: {
          bsonType: "date",
          description: "REQUERIDO: Fecha de inscripción"
        },
        periodo: {
          bsonType: "object",
          required: ["año", "ciclo"],
          properties: {
            año: { bsonType: "int", minimum: 2020, maximum: 2050 },
            ciclo: { enum: ["Primer Semestre", "Segundo Semestre", "Verano", "Invierno"] }
          }
        },
        estado: {
          enum: ["inscrito", "aprobado", "reprobado", "retirado", "en_curso"]
        },
        calificacion_final: {
          bsonType: ["double", "null"],
          minimum: 0,
          maximum: 100
        },
        calificacion_letra: {
          bsonType: ["string", "null"],
          enum: ["A", "B", "C", "D", "F", null]
        },
        asistencia: {
          bsonType: "object",
          properties: {
            clases_totales: { bsonType: "int", minimum: 0 },
            asistencias: { bsonType: "int", minimum: 0 },
            faltas: { bsonType: "int", minimum: 0 },
            tardanzas: { bsonType: "int", minimum: 0 },
            porcentaje: { bsonType: "double", minimum: 0, maximum: 100 }
          }
        },
        pago_realizado: {
          bsonType: "bool"
        },
        monto_pagado: {
          bsonType: "double",
          minimum: 0
        },
        moneda: {
          enum: ["MXN", "USD"]
        },
        observaciones: {
          bsonType: "string"
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        created_by: { bsonType: "objectId" },
        updated_by: { bsonType: "objectId" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'inscripciones' creada\n");

// ============================================
// 5. COLECCIÓN: CALIFICACIONES
// ============================================

print("Creando colección: CALIFICACIONES...");

db.createCollection("calificaciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "inscripcion_id",
        "estudiante_id",
        "curso_id",
        "tipo_evaluacion",
        "calificacion_obtenida",
        "calificacion_maxima",
        "estado",
        "created_at",
        "created_by"
      ],
      properties: {
        inscripcion_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia a la inscripción (FK a inscripciones._id)"
        },
        estudiante_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia al estudiante (FK a estudiantes._id)"
        },
        curso_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia al curso (FK a cursos._id)"
        },
        
        // === SNAPSHOTS ===
        estudiante_codigo: { bsonType: "string" },
        estudiante_nombre: { bsonType: "string" },
        curso_codigo: { bsonType: "string" },
        curso_nombre: { bsonType: "string" },
        
        tipo_evaluacion: {
          bsonType: "string",
          description: "REQUERIDO: Tipo de evaluación (Ej: Parcial 1, Final, Tarea 1)"
        },
        descripcion: {
          bsonType: "string",
          description: "Descripción detallada de la evaluación"
        },
        fecha_evaluacion: {
          bsonType: "date",
          description: "Fecha en que se realizó la evaluación"
        },
        
        // Aceptamos int, double o decimal porque mongosh no garantiza el tipo double
        calificacion_obtenida: {
          bsonType: ["double", "int", "decimal"],
          minimum: 0,
          maximum: 100,
          description: "REQUERIDO: Calificación obtenida (0-100)"
        },
        calificacion_maxima: {
          bsonType: ["double", "int", "decimal"],
          minimum: 0,
          maximum: 100,
          description: "REQUERIDO: Calificación máxima posible"
        },
        porcentaje_curso: {
          bsonType: ["double", "int", "decimal"],
          minimum: 0,
          maximum: 100,
          description: "Peso de esta evaluación en la nota final del curso (%)"
        },
        puntos_contribucion: {
          bsonType: ["double", "int", "decimal"],
          minimum: 0,
          description: "Puntos que aporta a la calificación final del curso"
        },
        
        estado: {
          enum: ["pendiente", "en_revision", "publicada", "impugnada"],
          description: "REQUERIDO: Estado de la calificación"
        },
        observaciones: {
          bsonType: "string",
          description: "Observaciones generales sobre la calificación"
        },
        retroalimentacion: {
          bsonType: "object",
          properties: {
            fortalezas: { bsonType: "string" },
            areas_mejora: { bsonType: "string" },
            comentario_profesor: { bsonType: "string" }
          },
          description: "Retroalimentación detallada para el estudiante"
        },
        registrado_por: {
          bsonType: "objectId",
          description: "ID del profesor que registró la calificación"
        },
        fecha_registro: {
          bsonType: "date",
          description: "Fecha en que se registró la calificación en el sistema"
        },
        
        // === CAMPOS DE AUDITORÍA ===
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
        created_by: { bsonType: "objectId" },
        updated_by: { bsonType: "objectId" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'calificaciones' creada con validación estricta");
print("Relación: inscripciones → calificaciones (1 a N)\n");

// ============================================
// 6. COLECCIÓN: ASISTENCIAS
// ============================================

print("Creando colección: ASISTENCIAS...");

db.createCollection("asistencias", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "curso_id",
        "fecha_clase",
        "asistencias",
        "created_at",
        "created_by"
      ],
      properties: {
        curso_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia al curso (FK a cursos._id)"
        },
        profesor_id: {
          bsonType: "objectId",
          description: "Referencia al profesor que impartió la clase"
        },
        fecha_clase: {
          bsonType: "date",
          description: "REQUERIDO: Fecha y hora de la clase"
        },
        hora_inicio: {
          bsonType: "string",
          pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$",
          description: "Hora de inicio (formato HH:MM)"
        },
        hora_fin: {
          bsonType: "string",
          pattern: "^([0-1][0-9]|2[0-3]):[0-5][0-9]$",
          description: "Hora de fin (formato HH:MM)"
        },
        
        // === SNAPSHOTS ===
        curso_codigo: {
          bsonType: "string",
          description: "Snapshot: Código del curso"
        },
        curso_nombre: {
          bsonType: "string",
          description: "Snapshot: Nombre del curso"
        },
        
        tema_clase: {
          bsonType: "string",
          description: "Tema o contenido de la clase"
        },
        
        // === LISTA DE ASISTENCIAS (EMBEDDING) ===
        asistencias: {
          bsonType: "array",
          minItems: 0,
          items: {
            bsonType: "object",
            required: ["estudiante_id", "estado"],
            properties: {
              estudiante_id: {
                bsonType: "objectId",
                description: "REQUERIDO: ID del estudiante"
              },
              estudiante_codigo: {
                bsonType: "string",
                description: "Código del estudiante"
              },
              estudiante_nombre: {
                bsonType: "string",
                description: "Nombre del estudiante"
              },
              estado: {
                enum: ["presente", "ausente", "tardanza", "justificado"],
                description: "REQUERIDO: Estado de asistencia"
              },
              hora_registro: {
                bsonType: ["date", "null"],
                description: "Hora en que se registró la asistencia"
              },
              observacion: {
                bsonType: "string",
                description: "Observación sobre la asistencia"
              }
            }
          },
          description: "REQUERIDO: Lista de asistencias de estudiantes"
        },
        
        // === RESUMEN (DESNORMALIZADO) ===
        resumen: {
          bsonType: "object",
          properties: {
            total_estudiantes: {
              bsonType: "int",
              minimum: 0,
              description: "Total de estudiantes en el curso"
            },
            presentes: {
              bsonType: "int",
              minimum: 0,
              description: "Cantidad de presentes"
            },
            ausentes: {
              bsonType: "int",
              minimum: 0,
              description: "Cantidad de ausentes"
            },
            tardanzas: {
              bsonType: "int",
              minimum: 0,
              description: "Cantidad de tardanzas"
            },
            porcentaje_asistencia: {
              bsonType: "double",
              minimum: 0,
              maximum: 100,
              description: "Porcentaje de asistencia de la clase"
            }
          },
          description: "Resumen estadístico de la asistencia"
        },
        
        // === CAMPOS DE AUDITORÍA ===
        created_at: {
          bsonType: "date",
          description: "REQUERIDO: Fecha de creación del registro"
        },
        updated_at: {
          bsonType: "date",
          description: "Fecha de última actualización"
        },
        created_by: {
          bsonType: "objectId",
          description: "REQUERIDO: Usuario que creó el registro (normalmente el profesor)"
        },
        updated_by: {
          bsonType: "objectId",
          description: "Usuario que actualizó el registro"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'asistencias' creada con validación estricta");
print("Patrón: Embedding de lista de estudiantes por clase\n");

// ============================================
// 7. COLECCIÓN: PAGOS
// ============================================

print("Creando colección: PAGOS...");

db.createCollection("pagos", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "numero_recibo",
        "estudiante_id",
        "concepto",
        "tipo",
        "total",
        "estado",
        "fecha_vencimiento",
        "created_at",
        "created_by"
      ],
      properties: {
        numero_recibo: {
          bsonType: "string",
          pattern: "^REC-[0-9]{4}-[0-9]{5}$",
          description: "REQUERIDO: Número único de recibo (REC-YYYY-NNNNN)"
        },
        estudiante_id: {
          bsonType: "objectId",
          description: "REQUERIDO: Referencia al estudiante (FK a estudiantes._id)"
        },
        
        // === SNAPSHOTS ===
        estudiante_codigo: {
          bsonType: "string",
          description: "Snapshot: Código del estudiante"
        },
        estudiante_nombre: {
          bsonType: "string",
          description: "Snapshot: Nombre del estudiante"
        },
        
        concepto: {
          bsonType: "string",
          minLength: 5,
          description: "REQUERIDO: Descripción del concepto de pago"
        },
        tipo: {
          enum: ["colegiatura", "inscripcion", "examen", "certificado", "multa", "otro"],
          description: "REQUERIDO: Tipo de pago"
        },
        periodo: {
          bsonType: "object",
          properties: {
            año: {
              bsonType: "int",
              minimum: 2020,
              maximum: 2050
            },
            mes: {
              bsonType: "string",
              description: "Mes del pago (ej: Enero, Febrero)"
            },
            ciclo: {
              bsonType: "string",
              description: "Ciclo académico"
            }
          },
          description: "Periodo al que corresponde el pago"
        },
        
        // === MONTOS ===
        subtotal: {
          bsonType: "double",
          minimum: 0,
          description: "Subtotal antes de descuentos/recargos"
        },
        descuento: {
          bsonType: "double",
          minimum: 0,
          description: "Monto de descuento aplicado"
        },
        recargo: {
          bsonType: "double",
          minimum: 0,
          description: "Monto de recargo aplicado (por pago tardío)"
        },
        total: {
          bsonType: "double",
          minimum: 0,
          description: "REQUERIDO: Total a pagar (subtotal - descuento + recargo)"
        },
        moneda: {
          enum: ["MXN", "USD"],
          description: "Moneda del pago"
        },
        
        // === MÉTODO DE PAGO ===
        metodo_pago: {
          enum: ["efectivo", "tarjeta", "transferencia", "cheque", "oxxo", "otro"],
          description: "Método de pago utilizado"
        },
        detalles_pago: {
          bsonType: ["object", "null"],
          properties: {
            banco: {
              bsonType: "string",
              description: "Banco (si aplica)"
            },
            referencia: {
              bsonType: "string",
              description: "Número de referencia/transacción"
            },
            fecha_transaccion: {
              bsonType: "date",
              description: "Fecha de la transacción bancaria"
            },
            autorizacion: {
              bsonType: "string",
              description: "Código de autorización"
            },
            ultimos_4_digitos: {
              bsonType: "string",
              pattern: "^[0-9]{4}$",
              description: "Últimos 4 dígitos de tarjeta (si aplica)"
            },
            referencia_oxxo: {
              bsonType: "string",
              description: "Número de referencia OXXO (si aplica)"
            }
          },
          description: "Detalles adicionales del pago"
        },
        
        // === ESTADO DEL PAGO ===
        estado: {
          enum: ["pendiente", "pagado", "vencido", "cancelado", "reembolsado"],
          description: "REQUERIDO: Estado del pago"
        },
        fecha_pago: {
          bsonType: ["date", "null"],
          description: "Fecha en que se realizó el pago (null si pendiente)"
        },
        fecha_vencimiento: {
          bsonType: "date",
          description: "REQUERIDO: Fecha límite de pago"
        },
        
        // === FACTURACIÓN (MÉXICO) ===
        factura: {
          bsonType: "object",
          properties: {
            requiere_factura: {
              bsonType: "bool",
              description: "Indica si requiere factura fiscal"
            },
            rfc: {
              bsonType: "string",
              pattern: "^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$",
              description: "RFC para facturación"
            },
            razon_social: {
              bsonType: "string",
              description: "Razón social para factura"
            },
            uso_cfdi: {
              bsonType: "string",
              description: "Uso de CFDI (G01, G03, etc.)"
            },
            uuid: {
              bsonType: "string",
              description: "UUID de factura (folio fiscal)"
            },
            fecha_timbrado: {
              bsonType: "date",
              description: "Fecha de timbrado de la factura"
            },
            xml_url: {
              bsonType: "string",
              description: "URL del archivo XML de la factura"
            },
            pdf_url: {
              bsonType: "string",
              description: "URL del PDF de la factura"
            }
          },
          description: "Información de facturación fiscal (México)"
        },
        
        // === OTROS ===
        registrado_por: {
          bsonType: "objectId",
          description: "Usuario que registró el pago"
        },
        comprobante_url: {
          bsonType: "string",
          description: "URL del comprobante de pago (PDF)"
        },
        observaciones: {
          bsonType: "string",
          description: "Observaciones sobre el pago"
        },
        
        // === CAMPOS DE AUDITORÍA ===
        created_at: {
          bsonType: "date",
          description: "REQUERIDO: Fecha de creación del registro"
        },
        updated_at: {
          bsonType: "date",
          description: "Fecha de última actualización"
        },
        created_by: {
          bsonType: "objectId",
          description: "REQUERIDO: Usuario que creó el registro"
        },
        updated_by: {
          bsonType: "objectId",
          description: "Usuario que actualizó el registro"
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

print("Colección 'pagos' creada con validación estricta");
print("Relación: estudiantes → pagos (1 a N)");
print("Incluye: Facturación electrónica (México)\n");

// ============================================
// ACTUALIZAR METADATA
// ============================================

db.metadata.updateOne(
  { _id: "database_info" },
  {
    $set: {
      ultima_actualizacion: new Date(),
      colecciones_creadas: 7,
      estado: "Colecciones creadas con validación"
    }
  }
);

// ============================================
// RESUMEN FINAL
// ============================================

print("=".repeat(70));
print("TODAS LAS COLECCIONES CREADAS EXITOSAMENTE");
print("=".repeat(70));

const colecciones = db.getCollectionNames().filter(c => c !== "metadata");

print("\nRESUMEN DE COLECCIONES:\n");

colecciones.forEach(function(col, index) {
  const validador = db.getCollectionInfos({name: col})[0].options.validator;
  const tieneValidacion = validador ? "✓" : "✗";
  print(`${index + 1}. ${col.toUpperCase()}`);
  print(`Validación: ${tieneValidacion}`);
});

print("\nCARACTERÍSTICAS IMPLEMENTADAS:\n");
print("  ✓ Validación estricta de esquemas (JSON Schema)");
print("  ✓ Campos de auditoría (created_at, updated_at, created_by, updated_by)");
print("  ✓ Relaciones documentadas (FK en comentarios)");
print("  ✓ Desnormalización controlada (snapshots)");
print("  ✓ Enumeraciones y validaciones de negocio");
print("  ✓ Rangos de valores validados");
print("  ✓ Patrones regex para códigos únicos");
print("  ✓ Adaptado para México (RFC, CURP, INE, facturación)");

print("\n🇲🇽 CONFIGURACIÓN MÉXICO:");
print("  ✓ Email institucional: @academia.edu.mx");
print("  ✓ Documentos: INE, CURP, RFC, Pasaporte");
print("  ✓ Moneda: MXN (peso mexicano)");
print("  ✓ Facturación electrónica (CFDI)");
print("  ✓ Códigos postales de 5 dígitos");
print("  ✓ Turnos: Matutino, Vespertino, Nocturno");

print("\nSIGUIENTE PASO:");
print("   Ejecutar: 02_crear_indices.mongodb.js\n");

print("=".repeat(70) + "\n");
