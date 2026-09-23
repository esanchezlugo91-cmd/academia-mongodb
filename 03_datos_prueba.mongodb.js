// ========================================================================
// AUTOR:           Sánchez Lugo Eduardo Alejandro
// FECHA:           22/09/2026
// DB:              Sistema Académico
// MOTOR:           MongoDB 7.0+
// DESCRIPCIÓN:     Poblado de datos de prueba - CON HISTORIAL DE ESTADOS
// VERSIÓN:         8.0
// ========================================================================
// NOTAS IMPORTANTES:
// - Las inscripciones, calificaciones y pagos se generan para TODOS los
//   estudiantes (activos, inactivos, egresados, retirados), porque
//   representan su HISTORIAL ACADÉMICO. Un estudiante retirado igual
//   tuvo inscripciones y calificaciones antes de salir.
// - El historial_estado documenta POR QUÉ cada estudiante/profesor cambió
//   de estado (baja, egreso, jubilación, etc.).
// ========================================================================

const DB_NAME = "academia_db";
use(DB_NAME);

print("\n" + "=".repeat(70));
print("POBLADO DE DATOS - SISTEMA ACADEMICO");
print("=".repeat(70) + "\n");

// ============================================
// CONFIGURACION GLOBAL - AJUSTA AQUI LOS TOTALES
// ============================================
const TOTAL_ESTUDIANTES          = 250;   // Total de estudiantes
const TOTAL_PROFESORES           = 30;    // Total de profesores (activos e inactivos)
const TOTAL_CURSOS               = 40;    // Total de cursos ofrecidos
const CURSOS_POR_ESTUDIANTE      = 5;     // Inscripciones = 250 x 5 = 1250
const EVALUACIONES_POR_INSC      = 4;     // Calificaciones = 1250 x 4 = 5000
const DIAS_ASISTENCIA_POR_CURSO  = 8;     // Asistencias = 40 x 8 = 320
const PAGOS_POR_ESTUDIANTE       = 3;     // Pagos = 250 x 3 = 750

const USER_ADMIN = ObjectId("000000000000000000000001");
const FECHA_ACTUAL = new Date();
const AÑO_ACTUAL = FECHA_ACTUAL.getFullYear();

// ============================================
// CATALOGOS COMPARTIDOS
// ============================================
const NOMBRES_HOMBRES = ["José", "Luis", "Carlos", "Juan", "Miguel", "Jorge", "Francisco", "Alejandro", "Ricardo", "Fernando", "Roberto", "Eduardo", "Javier", "Sergio", "Raúl"];
const NOMBRES_MUJERES = ["María", "Ana", "Laura", "Carmen", "Patricia", "Guadalupe", "Verónica", "Alejandra", "Daniela", "Fernanda", "Gabriela", "Adriana", "Claudia", "Lucía", "Sofía"];
const APELLIDOS = ["García", "Rodríguez", "Martínez", "Hernández", "López", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Cruz", "Morales", "Ortiz", "Gutiérrez", "Chávez", "Ramos"];
const CIUDADES_MEXICO = ["Ciudad de México", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "León", "Mérida", "Querétaro", "Cancún", "Toluca"];
const ESTADOS_MEXICO = ["Ciudad de México", "Jalisco", "Nuevo León", "Puebla", "Baja California", "Guanajuato", "Yucatán", "Querétaro", "Quintana Roo", "Estado de México"];

const ESTADOS_ASISTENCIA = ["presente", "presente", "presente", "presente", "ausente", "tardanza", "justificado"];
const HORAS_CLASE = [
    { inicio: "07:00", fin: "09:00" },
    { inicio: "09:00", fin: "11:00" },
    { inicio: "11:00", fin: "13:00" },
    { inicio: "14:00", fin: "16:00" },
    { inicio: "16:00", fin: "18:00" },
    { inicio: "18:00", fin: "20:00" }
];
const TEMAS_CLASE = [
    "Introducción al curso", "Repaso de conceptos básicos", "Ejercicios prácticos",
    "Examen parcial", "Proyecto en equipo", "Exposición de temas",
    "Laboratorio", "Discusión de lecturas", "Resolución de problemas",
    "Casos de estudio", "Repaso para examen final", "Clase magistral"
];

const ESTADOS_INSCRIPCION = ["inscrito", "aprobado", "reprobado", "retirado", "en_curso"];
const TIPOS_EVALUACION = ["Examen Parcial 1", "Examen Parcial 2", "Examen Final", "Tareas", "Proyecto Final", "Exposición", "Laboratorio"];
const ESTADOS_CALIF = ["pendiente", "en_revision", "publicada", "publicada", "publicada", "impugnada"];

const CARRERAS_EST = ["Ingeniería en Sistemas", "Administración", "Contabilidad", "Derecho", "Medicina", "Psicología", "Arquitectura", "Diseño Gráfico"];
const NIVELES_EST = ["Universidad", "Bachillerato", "Posgrado"];
const TURNOS_EST = ["Matutino", "Vespertino", "Nocturno", "Virtual"];
const ESTADOS_EST = ["activo", "activo", "activo", "activo", "activo", "inactivo", "egresado", "retirado", "suspendido"];

// Motivos narrativos para cambios de estado de ESTUDIANTES
const MOTIVOS_BAJA_EST = [
    "Suspensión temporal por adeudo",
    "Cambio de residencia",
    "Problemas de salud",
    "Decisión personal",
    "Baja por bajo rendimiento",
    "Cambio de carrera",
    "Motivos laborales"
];
const MOTIVOS_EGRESO_EST = [
    "Egreso por conclusión de plan de estudios",
    "Titulación anticipada"
];

const ESPECIALIDADES_PROF = [
    "Matemáticas", "Física", "Química", "Biología", "Historia",
    "Literatura", "Inglés", "Programación", "Bases de Datos",
    "Redes", "Contabilidad", "Derecho", "Psicología", "Medicina"
];
const SUBESPECIALIDADES_PROF = [
    "Cálculo", "Álgebra", "Estadística", "Inteligencia Artificial",
    "Machine Learning", "Desarrollo Web", "Ciberseguridad",
    "Auditoría", "Derecho Civil", "Derecho Penal"
];
const NIVELES_FORMACION = ["Licenciatura", "Maestría", "Doctorado", "Posdoctorado"];
const TIPOS_CONTRATO = ["Tiempo completo", "Medio tiempo", "Por horas", "Contratado"];
const ESTADOS_PROF = ["activo", "activo", "activo", "activo", "activo", "activo", "inactivo", "licencia", "jubilado"];
const DIAS_SEMANA_PROF = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const INSTITUCIONES = ["UNAM", "IPN", "Tec de Monterrey", "UAM", "BUAP", "UDG", "ITESM"];

// Motivos narrativos para cambios de estado de PROFESORES
const MOTIVOS_BAJA_PROF = [
    "Año sabático",
    "Cambio de institución",
    "Reducción de plantilla",
    "Motivos personales",
    "Reasignación administrativa"
];
const MOTIVOS_JUBILACION_PROF = [
    "Jubilación por años de servicio",
    "Jubilación anticipada",
    "Jubilación por edad"
];

const PREFIJOS_CURSO = {
    "Matemáticas": "MAT", "Física": "FIS", "Química": "QUI", "Biología": "BIO",
    "Historia": "HIS", "Literatura": "LIT", "Inglés": "ING", "Programación": "PRO",
    "Bases de Datos": "BDD", "Redes": "RED", "Contabilidad": "CON", "Derecho": "DER",
    "Psicología": "PSI", "Medicina": "MED"
};
const NOMBRES_CURSO = {
    "Matemáticas": ["Cálculo Diferencial", "Álgebra Lineal", "Estadística Inferencial", "Cálculo Integral"],
    "Física": ["Física Mecánica", "Electromagnetismo", "Termodinámica", "Física Moderna"],
    "Química": ["Química General", "Química Orgánica", "Bioquímica", "Química Analítica"],
    "Biología": ["Biología Celular", "Genética", "Ecología", "Anatomía Humana"],
    "Historia": ["Historia de México", "Historia Universal", "Historia Contemporánea"],
    "Literatura": ["Literatura Mexicana", "Literatura Universal", "Análisis Literario"],
    "Inglés": ["Inglés Básico", "Inglés Intermedio", "Inglés Avanzado", "Business English"],
    "Programación": ["Programación I", "Programación II", "Programación Orientada a Objetos", "Estructuras de Datos"],
    "Bases de Datos": ["Bases de Datos I", "Bases de Datos Avanzadas", "Modelado de Datos", "Big Data"],
    "Redes": ["Redes I", "Redes II", "Ciberseguridad", "Administración de Servidores"],
    "Contabilidad": ["Contabilidad General", "Contabilidad de Costos", "Auditoría", "Finanzas"],
    "Derecho": ["Derecho Civil", "Derecho Penal", "Derecho Laboral", "Derecho Constitucional"],
    "Psicología": ["Psicología General", "Psicología Clínica", "Psicología Social", "Desarrollo Humano"],
    "Medicina": ["Anatomía", "Fisiología", "Farmacología", "Patología"]
};

const NIVELES_CURSO = ["Universidad", "Bachillerato", "Posgrado"];
const ESTADOS_CURSO = ["activo", "activo", "activo", "activo", "activo", "inactivo", "cancelado", "finalizado"];
const CICLOS = ["Primer Semestre", "Segundo Semestre", "Verano", "Invierno"];
const DIAS_SEMANA_CURSO = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const AULAS = ["A-101", "A-102", "B-201", "B-202", "C-301", "C-302", "Lab-1", "Lab-2", "Lab-3", "Virtual-1"];
const CARRERAS_CURSO = ["Ingeniería en Sistemas", "Administración", "Contabilidad", "Derecho", "Medicina", "Psicología", "Arquitectura", "Diseño Gráfico"];

const TIPOS_PAGO = ["colegiatura", "inscripcion", "examen", "certificado", "multa", "otro"];
const METODOS_PAGO = ["efectivo", "tarjeta", "transferencia", "cheque", "oxxo", "otro"];
const ESTADOS_PAGO = ["pendiente", "pagado", "pagado", "pagado", "vencido", "cancelado", "reembolsado"];
const MESES_PAGO = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const CONCEPTOS_PAGO = {
    "colegiatura": ["Colegiatura mensual", "Colegiatura semestral"],
    "inscripcion": ["Inscripción al ciclo escolar", "Inscripción a curso"],
    "examen": ["Derecho a examen extraordinario", "Derecho a examen final"],
    "certificado": ["Certificado de estudios", "Constancia de calificaciones"],
    "multa": ["Multa por reposición de credencial", "Multa por daño a instalaciones"],
    "otro": ["Servicio administrativo", "Trámite escolar"]
};
const BANCOS_PAGO = ["BBVA", "Banorte", "Santander", "HSBC", "Banamex", "Scotiabank"];

// ============================================
// FUNCIONES AUXILIARES GLOBALES
// ============================================
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function limpiarTexto(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function asegurarDoubleRango(valor, min, max) {
    let v = Math.round(valor * 100) / 100;
    if (v < min) v = min + 0.01;
    if (v > max) v = max - 0.01;
    if (Number.isInteger(v)) v = v + 0.01;
    return v;
}

// ============================================================================
// 1. COLECCION: ESTUDIANTES
// ============================================================================

print("=".repeat(70));
print("1. COLECCION: ESTUDIANTES");
print("=".repeat(70) + "\n");

let contadorEmailEst = 0;

function generarNombreCompletoEst(genero) {
    let nombres = genero === "M" ? NOMBRES_HOMBRES : NOMBRES_MUJERES;
    let nombre = getRandomItem(nombres);
    let apellido1 = getRandomItem(APELLIDOS);
    let apellido2 = getRandomItem(APELLIDOS);
    return { nombres: nombre, apellidos: `${apellido1} ${apellido2}`, completo: `${nombre} ${apellido1} ${apellido2}` };
}

function generarEmailEst(nombre, apellido) {
    contadorEmailEst++;
    let inicial = limpiarTexto(nombre).charAt(0);
    let apellidoLimpio = limpiarTexto(apellido.split(" ")[0]);
    return `${inicial}.${apellidoLimpio}${contadorEmailEst}@academia.edu.mx`;
}

function generarFechaNacimientoEst(edadMin, edadMax) {
    let edad = getRandomInt(edadMin, edadMax);
    let fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() - edad);
    fecha.setMonth(getRandomInt(0, 11));
    fecha.setDate(getRandomInt(1, 28));
    return { fecha, edad };
}

function generarEstudiantes(cantidad) {
    let estudiantes = [];
    for (let i = 1; i <= cantidad; i++) {
        let codigo = `EST-${AÑO_ACTUAL}-${String(i).padStart(3, '0')}`;
        let genero = Math.random() > 0.5 ? "M" : "F";
        let { nombres, apellidos, completo } = generarNombreCompletoEst(genero);

        let emailInst = generarEmailEst(nombres, apellidos);
        let emailPersonal = `${limpiarTexto(nombres)}.${limpiarTexto(apellidos.split(" ")[0])}${i}@gmail.com`;
        let { fecha: fechaNac, edad } = generarFechaNacimientoEst(17, 30);
        let estadoEstudiante = getRandomItem(ESTADOS_EST);

        let curpSimulada = `CURP${String(i).padStart(6, '0')}${genero}XX${getRandomInt(10, 99)}ABC`.substring(0, 18);

        // Historial de estado: si NO esta activo, agregamos motivo
        let historialEstado = [];
        if (estadoEstudiante !== "activo") {
            let motivo;
            if (estadoEstudiante === "egresado") {
                motivo = getRandomItem(MOTIVOS_EGRESO_EST);
            } else {
                motivo = getRandomItem(MOTIVOS_BAJA_EST);
            }
            historialEstado.push({
                estado_anterior: "activo",
                estado_nuevo: estadoEstudiante,
                fecha_cambio: new Date(AÑO_ACTUAL, getRandomInt(0, 11), getRandomInt(1, 28)),
                motivo: motivo,
                cambiado_por: USER_ADMIN
            });
        }

        estudiantes.push({
            codigo_estudiante: codigo,
            nombres: nombres,
            apellidos: apellidos,
            nombre_completo: completo,
            documento: { tipo: "CURP", numero: curpSimulada },
            fecha_nacimiento: fechaNac,
            edad: edad,
            genero: genero,
            contacto: {
                email_personal: emailPersonal,
                email_institucional: emailInst,
                telefono: `55${getRandomInt(10000000, 99999999)}`,
                telefono_emergencia: `55${getRandomInt(10000000, 99999999)}`
            },
            direccion: {
                calle: `Calle ${getRandomItem(["Reforma", "Juárez", "Hidalgo", "Morelos", "Constitución"])}`,
                numero: String(getRandomInt(1, 999)),
                colonia: `Colonia ${getRandomItem(["Centro", "Norte", "Sur", "Las Flores", "El Mirador"])}`,
                ciudad: getRandomItem(CIUDADES_MEXICO),
                estado: getRandomItem(ESTADOS_MEXICO),
                codigo_postal: String(getRandomInt(10000, 99999)),
                pais: "México"
            },
            tutor: {
                nombre_completo: `${getRandomItem(NOMBRES_HOMBRES)} ${getRandomItem(APELLIDOS)}`,
                parentesco: getRandomItem(["Padre", "Madre", "Tutor Legal"]),
                telefono: `55${getRandomInt(10000000, 99999999)}`,
                email: `tutor${i}@email.com`
            },
            nivel: getRandomItem(NIVELES_EST),
            carrera: getRandomItem(CARRERAS_EST),
            semestre_actual: getRandomInt(1, 10),
            turno: getRandomItem(TURNOS_EST),
            estado: estadoEstudiante,
            historial_estado: historialEstado,
            fecha_ingreso: new Date(fechaNac.getFullYear() + 18, 7, 15),
            fecha_egreso: estadoEstudiante === "egresado" ? new Date(FECHA_ACTUAL.getFullYear() - 1, 6, 30) : null,
            estadisticas: {
                cursos_inscritos: getRandomInt(0, 10),
                cursos_aprobados: getRandomInt(0, 8),
                cursos_reprobados: getRandomInt(0, 2),
                promedio_general: asegurarDoubleRango(Math.random() * 10, 0, 10),
                total_faltas: getRandomInt(0, 20),
                creditos_acumulados: getRandomInt(0, 300)
            },
            documentos: [],
            observaciones: Math.random() > 0.8 ? "Estudiante con beca académica" : "",
            created_at: new Date(),
            updated_at: new Date(),
            created_by: USER_ADMIN,
            updated_by: USER_ADMIN
        });
    }
    return estudiantes;
}

print(`Generando datos para ${TOTAL_ESTUDIANTES} estudiantes...`);
db.estudiantes.deleteMany({});
print("Documentos previos eliminados.");

let nuevosEstudiantes = generarEstudiantes(TOTAL_ESTUDIANTES);
let insertadosEst = 0;
let erroresEst = 0;

nuevosEstudiantes.forEach((est) => {
    try {
        db.estudiantes.insertOne(est);
        insertadosEst++;
    } catch (e) {
        erroresEst++;
        print(`Error en ${est.codigo_estudiante}: ${e.message}`);
    }
});

print(`Estudiantes insertados: ${insertadosEst}`);
print(`Errores: ${erroresEst}`);
print(`Total en DB: ${db.estudiantes.countDocuments()}`);
print("");

// ============================================================================
// 2. COLECCION: PROFESORES
// ============================================================================

print("=".repeat(70));
print("2. COLECCION: PROFESORES");
print("=".repeat(70) + "\n");

let contadorEmailProf = 0;

function generarNombreCompletoProf(genero) {
    let nombres = genero === "M" ? NOMBRES_HOMBRES : NOMBRES_MUJERES;
    let nombre = getRandomItem(nombres);
    let apellido1 = getRandomItem(APELLIDOS);
    let apellido2 = getRandomItem(APELLIDOS);
    return { nombres: nombre, apellidos: `${apellido1} ${apellido2}`, completo: `${nombre} ${apellido1} ${apellido2}` };
}

function generarEmailProf(nombre, apellido) {
    contadorEmailProf++;
    let inicial = limpiarTexto(nombre).charAt(0);
    let apellidoLimpio = limpiarTexto(apellido.split(" ")[0]);
    return `${inicial}.${apellidoLimpio}${contadorEmailProf}@academia.edu.mx`;
}

function generarFechaNacimientoProf(edadMin, edadMax) {
    let edad = getRandomInt(edadMin, edadMax);
    let fecha = new Date();
    fecha.setFullYear(fecha.getFullYear() - edad);
    fecha.setMonth(getRandomInt(0, 11));
    fecha.setDate(getRandomInt(1, 28));
    return { fecha, edad };
}

function generarRFC(nombres, apellidos, fechaNac) {
    let letras = (limpiarTexto(apellidos).substring(0, 2) + limpiarTexto(nombres).charAt(0)).toUpperCase();
    letras = letras.padEnd(4, 'X').substring(0, 4);
    let año = String(fechaNac.getFullYear()).substring(2);
    let mes = String(fechaNac.getMonth() + 1).padStart(2, '0');
    let dia = String(fechaNac.getDate()).padStart(2, '0');
    let homoclave = String(getRandomInt(100, 999));
    return `${letras}${año}${mes}${dia}${homoclave}`;
}

function generarProfesores(cantidad) {
    let profesores = [];
    let rfcGenerados = new Set();

    for (let i = 1; i <= cantidad; i++) {
        let codigo = `PROF-${AÑO_ACTUAL}-${String(i).padStart(3, '0')}`;
        let genero = Math.random() > 0.5 ? "M" : "F";
        let { nombres, apellidos, completo } = generarNombreCompletoProf(genero);

        let emailInst = generarEmailProf(nombres, apellidos);
        let emailPersonal = `${limpiarTexto(nombres)}.${limpiarTexto(apellidos.split(" ")[0])}${i}@gmail.com`;
        let { fecha: fechaNac } = generarFechaNacimientoProf(30, 65);

        let rfc;
        do {
            rfc = generarRFC(nombres, apellidos, fechaNac);
        } while (rfcGenerados.has(rfc));
        rfcGenerados.add(rfc);

        let curpSimulada = `CURP${String(i).padStart(6, '0')}${genero}XX${getRandomInt(10, 99)}ABC`.substring(0, 18);

        let numFormacion = getRandomInt(1, 3);
        let formacion = [];
        for (let f = 0; f < numFormacion; f++) {
            formacion.push({
                nivel: getRandomItem(NIVELES_FORMACION),
                titulo: `Título en ${getRandomItem(ESPECIALIDADES_PROF)}`,
                institucion: getRandomItem(INSTITUCIONES),
                año_obtencion: getRandomInt(1990, 2020)
            });
        }

        let numHorarios = getRandomInt(2, 5);
        let horarios = [];
        for (let h = 0; h < numHorarios; h++) {
            horarios.push({
                dia: getRandomItem(DIAS_SEMANA_PROF),
                hora_inicio: `${String(getRandomInt(7, 18)).padStart(2, '0')}:00`,
                hora_fin: `${String(getRandomInt(19, 22)).padStart(2, '0')}:00`
            });
        }

        let numSubs = getRandomInt(1, 3);
        let subespecialidades = [];
        for (let s = 0; s < numSubs; s++) {
            subespecialidades.push(getRandomItem(SUBESPECIALIDADES_PROF));
        }

        let estadoProfesor = getRandomItem(ESTADOS_PROF);
        let tipoContrato = getRandomItem(TIPOS_CONTRATO);
        let experiencia = getRandomInt(1, 40);

        // Historial de estado
        let historialEstadoProf = [];
        if (estadoProfesor !== "activo") {
            let motivo;
            if (estadoProfesor === "jubilado") {
                motivo = getRandomItem(MOTIVOS_JUBILACION_PROF);
            } else {
                motivo = getRandomItem(MOTIVOS_BAJA_PROF);
            }
            historialEstadoProf.push({
                estado_anterior: "activo",
                estado_nuevo: estadoProfesor,
                fecha_cambio: new Date(AÑO_ACTUAL, getRandomInt(0, 11), getRandomInt(1, 28)),
                motivo: motivo,
                cambiado_por: USER_ADMIN
            });
        }

        profesores.push({
            codigo_profesor: codigo,
            nombres: nombres,
            apellidos: apellidos,
            nombre_completo: completo,
            documento: { tipo: "CURP", numero: curpSimulada },
            rfc: rfc,
            fecha_nacimiento: fechaNac,
            genero: genero,
            contacto: {
                email_personal: emailPersonal,
                email_institucional: emailInst,
                telefono: `55${getRandomInt(10000000, 99999999)}`,
                linkedin: `https://linkedin.com/in/${limpiarTexto(nombres)}-${limpiarTexto(apellidos.split(" ")[0])}${i}`
            },
            direccion: {
                calle: `Calle ${getRandomItem(["Reforma", "Juárez", "Hidalgo", "Morelos", "Constitución"])}`,
                numero: String(getRandomInt(1, 999)),
                colonia: `Colonia ${getRandomItem(["Centro", "Norte", "Sur", "Las Flores", "El Mirador"])}`,
                ciudad: getRandomItem(CIUDADES_MEXICO),
                estado: getRandomItem(ESTADOS_MEXICO),
                codigo_postal: String(getRandomInt(10000, 99999)),
                pais: "México"
            },
            especialidad: getRandomItem(ESPECIALIDADES_PROF),
            subespecialidades: subespecialidades,
            formacion_academica: formacion,
            experiencia_años: experiencia,
            horarios_disponibles: horarios,
            tipo_contrato: tipoContrato,
            fecha_contratacion: new Date(FECHA_ACTUAL.getFullYear() - getRandomInt(1, experiencia), getRandomInt(0, 11), getRandomInt(1, 28)),
            salario: {
                monto: asegurarDoubleRango(Math.random() * 65000 + 15000, 0, 100000),
                moneda: "MXN",
                periodo: getRandomItem(["mensual", "quincenal", "semanal", "por hora"])
            },
            estado: estadoProfesor,
            historial_estado: historialEstadoProf,
            estadisticas: {
                cursos_impartiendo: getRandomInt(0, 5),
                total_estudiantes: getRandomInt(0, 150),
                años_en_institucion: getRandomInt(0, experiencia),
                calificacion_promedio: asegurarDoubleRango(Math.random() * 5, 0, 5)
            },
            documentos: [],
            created_at: new Date(),
            updated_at: new Date(),
            created_by: USER_ADMIN,
            updated_by: USER_ADMIN
        });
    }
    return profesores;
}

print(`Generando datos para ${TOTAL_PROFESORES} profesores...`);
db.profesores.deleteMany({});
print("Documentos previos eliminados.");

let nuevosProfesores = generarProfesores(TOTAL_PROFESORES);
let insertadosProf = 0;
let erroresProf = 0;

nuevosProfesores.forEach((prof) => {
    try {
        db.profesores.insertOne(prof);
        insertadosProf++;
    } catch (e) {
        erroresProf++;
        print(`Error en ${prof.codigo_profesor}: ${e.message}`);
    }
});

print(`Profesores insertados: ${insertadosProf}`);
print(`Errores: ${erroresProf}`);
print(`Total en DB: ${db.profesores.countDocuments()}`);
print("");

// ============================================================================
// 3. COLECCION: CURSOS
// ============================================================================

print("=".repeat(70));
print("3. COLECCION: CURSOS");
print("=".repeat(70) + "\n");

let contadorCodigoCurso = 0;

function generarCodigoCurso(prefijo) {
    contadorCodigoCurso++;
    let numero = String(100 + contadorCodigoCurso).padStart(3, '0');
    return `${prefijo}-${numero}`;
}

function generarHorarioCurso() {
    let numBloques = getRandomInt(1, 3);
    let horarios = [];
    let diasUsados = new Set();
    for (let i = 0; i < numBloques; i++) {
        let dia;
        let intentos = 0;
        do {
            dia = getRandomItem(DIAS_SEMANA_CURSO);
            intentos++;
        } while (diasUsados.has(dia) && intentos < 20);
        diasUsados.add(dia);
        let horaInicio = getRandomInt(7, 18);
        let duracion = getRandomInt(1, 2);
        let horaFin = Math.min(horaInicio + duracion, 22);
        horarios.push({
            dia: dia,
            hora_inicio: `${String(horaInicio).padStart(2, '0')}:00`,
            hora_fin: `${String(horaFin).padStart(2, '0')}:00`,
            aula: getRandomItem(AULAS)
        });
    }
    return horarios;
}

function generarSyllabus(nombreCurso) {
    let numUnidades = getRandomInt(3, 6);
    let syllabus = [];
    for (let u = 1; u <= numUnidades; u++) {
        syllabus.push({
            unidad: u,
            tema: `Unidad ${u}: ${nombreCurso} - Parte ${u}`,
            subtemas: [`Subtema ${u}.1`, `Subtema ${u}.2`, `Subtema ${u}.3`],
            horas: getRandomInt(8, 20)
        });
    }
    return syllabus;
}

function generarSistemaEvaluacion() {
    let tipos = [
        { tipo: "Examen Parcial 1", porcentaje: getRandomInt(15, 25) },
        { tipo: "Examen Parcial 2", porcentaje: getRandomInt(15, 25) },
        { tipo: "Examen Final", porcentaje: getRandomInt(20, 30) },
        { tipo: "Tareas", porcentaje: getRandomInt(10, 20) },
        { tipo: "Proyecto Final", porcentaje: getRandomInt(10, 20) }
    ];
    let suma = tipos.reduce((acc, t) => acc + t.porcentaje, 0);
    let factor = 100 / suma;
    tipos.forEach(t => {
        t.porcentaje = Math.round(t.porcentaje * factor);
        t.fecha = null;
    });
    let nuevaSuma = tipos.reduce((acc, t) => acc + t.porcentaje, 0);
    tipos[tipos.length - 1].porcentaje += (100 - nuevaSuma);
    return tipos;
}

function generarRecursos() {
    let recursos = [];
    let numRecursos = getRandomInt(2, 4);
    let tipos = ["PDF", "Video", "Libro", "Artículo", "Presentación"];
    for (let i = 0; i < numRecursos; i++) {
        recursos.push({
            tipo: getRandomItem(tipos),
            titulo: `Recurso de apoyo ${i + 1}`,
            url: `https://recursos.academia.edu.mx/curso/recurso${i + 1}.pdf`
        });
    }
    return recursos;
}

function generarCursos(cantidad, profesores) {
    let cursos = [];
    let codigosGenerados = new Set();

    for (let i = 1; i <= cantidad; i++) {
        try {
            let profesor = getRandomItem(profesores);
            let especialidad = profesor.especialidad;
            let prefijo = PREFIJOS_CURSO[especialidad] || "GEN";

            let nombresPosibles = NOMBRES_CURSO[especialidad];
            if (!nombresPosibles || nombresPosibles.length === 0) {
                nombresPosibles = [`Curso de ${especialidad}`];
            }

            let codigo;
            let intentos = 0;
            do {
                codigo = generarCodigoCurso(prefijo);
                intentos++;
                if (intentos > 500) {
                    throw new Error("No se pudo generar codigo unico despues de 500 intentos");
                }
            } while (codigosGenerados.has(codigo));
            codigosGenerados.add(codigo);

            let nombre = getRandomItem(nombresPosibles);
            let nivel = getRandomItem(NIVELES_CURSO);
            let estado = getRandomItem(ESTADOS_CURSO);
            let ciclo = getRandomItem(CICLOS);

            let fechaInicio = new Date(AÑO_ACTUAL, getRandomInt(0, 11), getRandomInt(1, 28));
            let fechaFin = new Date(fechaInicio);
            fechaFin.setMonth(fechaFin.getMonth() + 4);

            let capacidadMaxima = getRandomInt(20, 60);
            let estudiantesInscritos = getRandomInt(0, capacidadMaxima);

            cursos.push({
                codigo_curso: codigo,
                nombre: nombre,
                descripcion: `Curso de ${especialidad} - ${nombre}. Nivel ${nivel}.`,
                nivel: nivel,
                carrera: getRandomItem(CARRERAS_CURSO),
                semestre: getRandomInt(1, 10),
                creditos: getRandomInt(3, 10),
                profesor_id: profesor._id,
                profesor_nombre: profesor.nombre_completo,
                horario: generarHorarioCurso(),
                capacidad_maxima: capacidadMaxima,
                estudiantes_inscritos: estudiantesInscritos,
                periodo: {
                    año: AÑO_ACTUAL,
                    ciclo: ciclo,
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                },
                syllabus: generarSyllabus(nombre),
                sistema_evaluacion: generarSistemaEvaluacion(),
                recursos: generarRecursos(),
                prerrequisitos: [],
                estado: estado,
                estadisticas: {
                    promedio_calificaciones: asegurarDoubleRango(Math.random() * 10, 0, 10),
                    tasa_aprobacion: asegurarDoubleRango(Math.random() * 100, 0, 100),
                    asistencia_promedio: asegurarDoubleRango(Math.random() * 100, 0, 100)
                },
                created_at: new Date(),
                updated_at: new Date(),
                created_by: USER_ADMIN,
                updated_by: USER_ADMIN
            });

        } catch (err) {
            print(`Error generando curso #${i}: ${err.message}`);
        }
    }
    return cursos;
}

let profesoresParaCursos = db.profesores.find(
    { estado: "activo" },
    { _id: 1, codigo_profesor: 1, nombre_completo: 1, especialidad: 1 }
).toArray();

print(`Profesores activos encontrados en DB: ${profesoresParaCursos.length}`);
print("");

if (profesoresParaCursos.length === 0) {
    print("No hay profesores activos en la base de datos.");
    print("Ejecuta primero el bloque de PROFESORES.\n");
} else {
    print("Limpiando coleccion 'cursos'...");
    let deleteResultCursos = db.cursos.deleteMany({});
    print(`Documentos previos eliminados: ${deleteResultCursos.deletedCount}`);
    print("");

    print(`Generando ${TOTAL_CURSOS} cursos...`);
    let nuevosCursos = generarCursos(TOTAL_CURSOS, profesoresParaCursos);
    print(`Cursos generados en memoria: ${nuevosCursos.length}`);
    print("");

    if (nuevosCursos.length === 0) {
        print("No se genero ningun curso. Revisa los errores arriba.");
    } else {
        print("Insertando documentos...");
        let insertadosCursos = 0;
        let erroresCursos = 0;

        nuevosCursos.forEach((curso) => {
            try {
                db.cursos.insertOne(curso);
                insertadosCursos++;
            } catch (e) {
                erroresCursos++;
                if (erroresCursos <= 3) {
                    print(`Error insertando ${curso.codigo_curso}: ${e.message}`);
                }
            }
        });

        print("");
        print(`Cursos insertados: ${insertadosCursos}`);
        print(`Errores: ${erroresCursos}`);
        print(`Total en DB: ${db.cursos.countDocuments()}`);

        if (insertadosCursos > 0) {
            print("");
            print("Ejemplo de curso insertado:");
            let ejemplo = db.cursos.findOne();
            print(`Codigo: ${ejemplo.codigo_curso}`);
            print(`Nombre: ${ejemplo.nombre}`);
            print(`Profesor: ${ejemplo.profesor_nombre}`);
            print(`Nivel: ${ejemplo.nivel}`);
            print(`Creditos: ${ejemplo.creditos}`);
            print(`Capacidad: ${ejemplo.estudiantes_inscritos}/${ejemplo.capacidad_maxima}`);
            print(`Periodo: ${ejemplo.periodo.ciclo} ${ejemplo.periodo.año}`);
            print(`Estado: ${ejemplo.estado}`);
        }
    }
}

// ============================================================================
// 4. COLECCION: ASISTENCIAS
// ============================================================================

print("");
print("=".repeat(70));
print("4. COLECCION: ASISTENCIAS");
print("=".repeat(70) + "\n");

let cursosParaAsistencias = db.cursos.find(
    {},
    { _id: 1, codigo_curso: 1, nombre: 1, profesor_id: 1, profesor_nombre: 1 }
).toArray();

print(`Cursos encontrados en DB: ${cursosParaAsistencias.length}`);

if (cursosParaAsistencias.length === 0) {
    print("No hay cursos en la base de datos.");
    print("Ejecuta primero el bloque de CURSOS.\n");
} else {
    let estudiantesParaAsistencias = db.estudiantes.find(
        { estado: "activo" },
        { _id: 1, codigo_estudiante: 1, nombre_completo: 1 }
    ).toArray();

    print(`Estudiantes activos disponibles: ${estudiantesParaAsistencias.length}`);
    print(`Total esperado de asistencias: ${cursosParaAsistencias.length * DIAS_ASISTENCIA_POR_CURSO}`);
    print("");

    function generarFechaClase(diasAtras) {
        let fecha = new Date();
        fecha.setDate(fecha.getDate() - diasAtras);
        if (fecha.getDay() === 0) {
            fecha.setDate(fecha.getDate() + 1);
        }
        return fecha;
    }

    function generarListaAsistencias(estudiantes, fechaClase) {
        let asistencias = [];
        estudiantes.forEach(est => {
            let estado = getRandomItem(ESTADOS_ASISTENCIA);
            let horaRegistro = null;
            if (estado === "presente" || estado === "tardanza") {
                let hora = new Date(fechaClase);
                let minutos = estado === "tardanza" ? getRandomInt(15, 30) : getRandomInt(0, 10);
                hora.setHours(7, minutos, 0, 0);
                horaRegistro = hora;
            }
            asistencias.push({
                estudiante_id: est._id,
                estudiante_codigo: est.codigo_estudiante,
                estudiante_nombre: est.nombre_completo,
                estado: estado,
                hora_registro: horaRegistro,
                observacion: estado === "justificado" ? "Justificante médico presentado" : ""
            });
        });
        return asistencias;
    }

    function calcularResumen(asistencias) {
        let presentes = 0, ausentes = 0, tardanzas = 0;
        asistencias.forEach(a => {
            if (a.estado === "presente") presentes++;
            else if (a.estado === "ausente") ausentes++;
            else if (a.estado === "tardanza") tardanzas++;
        });
        let total = asistencias.length;
        let porcentaje = total > 0 ? asegurarDoubleRango((presentes + tardanzas) / total * 100, 0, 100) : 0;
        return {
            total_estudiantes: total,
            presentes: presentes,
            ausentes: ausentes,
            tardanzas: tardanzas,
            porcentaje_asistencia: porcentaje
        };
    }

    function generarAsistencias(cursos, estudiantes, diasPorCurso) {
        let registros = [];
        cursos.forEach(curso => {
            let numEstudiantes = getRandomInt(15, Math.min(30, estudiantes.length));
            let estudiantesMezclados = [...estudiantes].sort(() => Math.random() - 0.5);
            let estudiantesCurso = estudiantesMezclados.slice(0, numEstudiantes);

            // Generar EXACTAMENTE diasPorCurso registros para este curso
            for (let d = 0; d < diasPorCurso; d++) {
                let fechaClase = generarFechaClase(d * 7 + getRandomInt(0, 3));
                let horaClase = getRandomItem(HORAS_CLASE);
                let listaAsistencias = generarListaAsistencias(estudiantesCurso, fechaClase);
                let resumen = calcularResumen(listaAsistencias);

                registros.push({
                    curso_id: curso._id,
                    profesor_id: curso.profesor_id,
                    curso_codigo: curso.codigo_curso,
                    curso_nombre: curso.nombre,
                    fecha_clase: fechaClase,
                    hora_inicio: horaClase.inicio,
                    hora_fin: horaClase.fin,
                    tema_clase: getRandomItem(TEMAS_CLASE),
                    asistencias: listaAsistencias,
                    resumen: resumen,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: USER_ADMIN,
                    updated_by: USER_ADMIN
                });
            }
        });
        return registros;
    }

    print("Limpiando coleccion 'asistencias'...");
    let deleteResultAsist = db.asistencias.deleteMany({});
    print(`Documentos previos eliminados: ${deleteResultAsist.deletedCount}`);
    print("");

    print(`Generando ${DIAS_ASISTENCIA_POR_CURSO} dias de clase por cada curso...`);
    let nuevosRegistros = generarAsistencias(cursosParaAsistencias, estudiantesParaAsistencias, DIAS_ASISTENCIA_POR_CURSO);
    print(`Registros de asistencia generados en memoria: ${nuevosRegistros.length}`);
    print("");

    print("Insertando documentos...");
    let insertadosAsist = 0;
    let erroresAsist = 0;

    nuevosRegistros.forEach((reg) => {
        try {
            db.asistencias.insertOne(reg);
            insertadosAsist++;
        } catch (e) {
            erroresAsist++;
            if (erroresAsist <= 3) {
                print(`Error insertando asistencia curso ${reg.curso_codigo}: ${e.message}`);
            }
        }
    });

    print("");
    print(`Asistencias insertadas: ${insertadosAsist}`);
    print(`Errores: ${erroresAsist}`);
    print(`Total en DB: ${db.asistencias.countDocuments()}`);

    if (insertadosAsist > 0) {
        print("");
        print("Ejemplo de asistencia insertada:");
        let ejemplo = db.asistencias.findOne();
        print(`Curso: ${ejemplo.curso_codigo} - ${ejemplo.curso_nombre}`);
        print(`Fecha: ${ejemplo.fecha_clase}`);
        print(`Tema: ${ejemplo.tema_clase}`);
        print(`Total estudiantes: ${ejemplo.resumen.total_estudiantes}`);
        print(`Presentes: ${ejemplo.resumen.presentes}`);
        print(`Ausentes: ${ejemplo.resumen.ausentes}`);
        print(`Tardanzas: ${ejemplo.resumen.tardanzas}`);
        print(`Porcentaje asistencia: ${ejemplo.resumen.porcentaje_asistencia}`);
    }
}
// ============================================================================
// 5. COLECCION: INSCRIPCIONES
// ============================================================================
// Estrategia: para cada estudiante, garantizar exactamente CURSOS_POR_ESTUDIANTE
// cursos distintos. Si una combinación ya existe (mismo estudiante + curso +
// periodo), se REINTENTA con otro curso aleatorio hasta lograrlo.

print("");
print("=".repeat(70));
print("5. COLECCION: INSCRIPCIONES");
print("=".repeat(70) + "\n");

let estudiantesParaInsc = db.estudiantes.find(
    {},
    { _id: 1, codigo_estudiante: 1, nombre_completo: 1 }
).toArray();

let cursosParaInsc = db.cursos.find(
    {},
    { _id: 1, codigo_curso: 1, nombre: 1, creditos: 1, periodo: 1, nivel: 1 }
).toArray();

print(`Estudiantes disponibles (todos): ${estudiantesParaInsc.length}`);
print(`Cursos disponibles: ${cursosParaInsc.length}`);
print(`Cursos por estudiante: ${CURSOS_POR_ESTUDIANTE}`);
print(`Total esperado: ${estudiantesParaInsc.length * CURSOS_POR_ESTUDIANTE}`);
print("");

if (estudiantesParaInsc.length === 0 || cursosParaInsc.length === 0) {
    print("Faltan estudiantes o cursos.");
    print("Ejecuta primero los bloques anteriores.\n");
} else {
    function generarInscripciones(estudiantes, cursos, cursosPorEstudiante) {
        let inscripciones = [];
        let combinacionesGlobales = new Set(); // Para garantizar unicidad global (RN-003)

        estudiantes.forEach(est => {
            let cursosAsignados = [];
            let cursosUsadosPorEstudiante = new Set();
            let intentos = 0;
            let maxIntentos = cursosPorEstudiante * 50; // Limite de seguridad

            // Mientras no tenga los cursos necesarios, seguir intentando
            while (cursosAsignados.length < cursosPorEstudiante && intentos < maxIntentos) {
                intentos++;
                let curso = getRandomItem(cursos);

                // Evitar duplicar el mismo curso para el mismo estudiante
                if (cursosUsadosPorEstudiante.has(curso._id.toString())) continue;

                // Verificar que la combinacion no exista globalmente (RN-003)
                let claveGlobal = `${est._id}_${curso._id}_${curso.periodo.año}_${curso.periodo.ciclo}`;
                if (combinacionesGlobales.has(claveGlobal)) continue;

                // Aceptar curso
                cursosUsadosPorEstudiante.add(curso._id.toString());
                combinacionesGlobales.add(claveGlobal);
                cursosAsignados.push(curso);
            }

            // Si despues de todos los intentos no alcanzo, buscar de forma deterministica
            if (cursosAsignados.length < cursosPorEstudiante) {
                let cursosMezclados = [...cursos].sort(() => Math.random() - 0.5);
                for (let curso of cursosMezclados) {
                    if (cursosAsignados.length >= cursosPorEstudiante) break;
                    if (cursosUsadosPorEstudiante.has(curso._id.toString())) continue;
                    let claveGlobal = `${est._id}_${curso._id}_${curso.periodo.año}_${curso.periodo.ciclo}`;
                    if (combinacionesGlobales.has(claveGlobal)) continue;
                    cursosUsadosPorEstudiante.add(curso._id.toString());
                    combinacionesGlobales.add(claveGlobal);
                    cursosAsignados.push(curso);
                }
            }

            // Generar las inscripciones para los cursos asignados
            cursosAsignados.forEach(curso => {
                let estado = getRandomItem(ESTADOS_INSCRIPCION);
                let calificacionFinal = null;
                let calificacionLetra = null;

                if (estado === "aprobado" || estado === "reprobado") {
                    calificacionFinal = asegurarDoubleRango(Math.random() * 100, 0, 100);
                    if (calificacionFinal >= 90) calificacionLetra = "A";
                    else if (calificacionFinal >= 80) calificacionLetra = "B";
                    else if (calificacionFinal >= 70) calificacionLetra = "C";
                    else if (calificacionFinal >= 60) calificacionLetra = "D";
                    else calificacionLetra = "F";
                }

                let asistencias = getRandomInt(20, 40);
                let faltas = getRandomInt(0, 5);
                let tardanzas = getRandomInt(0, 3);
                let porcentajeAsist = asegurarDoubleRango(Math.random() * 50 + 50, 0, 100);
                let montoPagado = asegurarDoubleRango(Math.random() * 4500 + 500, 0, 10000);

                inscripciones.push({
                    estudiante_id: est._id,
                    curso_id: curso._id,
                    estudiante_codigo: est.codigo_estudiante,
                    estudiante_nombre: est.nombre_completo,
                    curso_codigo: curso.codigo_curso,
                    curso_nombre: curso.nombre,
                    fecha_inscripcion: new Date(AÑO_ACTUAL, getRandomInt(0, 11), getRandomInt(1, 28)),
                    periodo: {
                        año: curso.periodo.año,
                        ciclo: curso.periodo.ciclo
                    },
                    estado: estado,
                    calificacion_final: calificacionFinal,
                    calificacion_letra: calificacionLetra,
                    asistencia: {
                        clases_totales: asistencias + faltas,
                        asistencias: asistencias,
                        faltas: faltas,
                        tardanzas: tardanzas,
                        porcentaje: porcentajeAsist
                    },
                    pago_realizado: Math.random() > 0.2,
                    monto_pagado: montoPagado,
                    moneda: "MXN",
                    observaciones: "",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: USER_ADMIN,
                    updated_by: USER_ADMIN
                });
            });
        });

        return inscripciones;
    }

    print("Limpiando coleccion 'inscripciones'...");
    let deleteResultInsc = db.inscripciones.deleteMany({});
    print(`Documentos previos eliminados: ${deleteResultInsc.deletedCount}`);
    print("");

    print(`Generando inscripciones (${CURSOS_POR_ESTUDIANTE} cursos garantizados por estudiante)...`);
    let nuevasInscripciones = generarInscripciones(estudiantesParaInsc, cursosParaInsc, CURSOS_POR_ESTUDIANTE);
    let totalEsperado = estudiantesParaInsc.length * CURSOS_POR_ESTUDIANTE;
    print(`Inscripciones generadas en memoria: ${nuevasInscripciones.length} (esperado: ${totalEsperado})`);
    print("");

    print("Insertando documentos...");
    let insertadosInsc = 0;
    let erroresInsc = 0;
    let detallesErroresInsc = [];

    nuevasInscripciones.forEach((insc) => {
        try {
            db.inscripciones.insertOne(insc);
            insertadosInsc++;
        } catch (e) {
            erroresInsc++;
            if (detallesErroresInsc.length < 2) {
                let errInfo = e.writeErrors ? e.writeErrors[0].err : e;
                detallesErroresInsc.push({
                    estudiante: insc.estudiante_codigo,
                    curso: insc.curso_codigo,
                    detalle: JSON.stringify(errInfo, null, 2)
                });
            }
        }
    });

    print("");
    print(`Inscripciones insertadas: ${insertadosInsc}`);
    print(`Errores: ${erroresInsc}`);
    print(`Total en DB: ${db.inscripciones.countDocuments()}`);

    if (detallesErroresInsc.length > 0) {
        print("");
        print("=== DETALLES DE ERRORES EN INSCRIPCIONES ===");
        detallesErroresInsc.forEach(err => {
            print("");
            print(`--- ${err.estudiante} / ${err.curso} ---`);
            print(err.detalle);
        });
    }

    if (insertadosInsc > 0) {
        print("");
        print("Ejemplo de inscripcion insertada:");
        let ejemplo = db.inscripciones.findOne();
        print(`Estudiante: ${ejemplo.estudiante_codigo} - ${ejemplo.estudiante_nombre}`);
        print(`Curso: ${ejemplo.curso_codigo} - ${ejemplo.curso_nombre}`);
        print(`Estado: ${ejemplo.estado}`);
        print(`Calificacion final: ${ejemplo.calificacion_final}`);
        print(`Periodo: ${ejemplo.periodo.ciclo} ${ejemplo.periodo.año}`);
    }
}
// ============================================================================
// 6. COLECCION: CALIFICACIONES
// ============================================================================

print("");
print("=".repeat(70));
print("6. COLECCION: CALIFICACIONES");
print("=".repeat(70) + "\n");

let inscripcionesParaCalif = db.inscripciones.find(
    {},
    { _id: 1, estudiante_id: 1, curso_id: 1, estudiante_codigo: 1, estudiante_nombre: 1, curso_codigo: 1, curso_nombre: 1 }
).toArray();

print(`Inscripciones disponibles: ${inscripcionesParaCalif.length}`);
print("");

if (inscripcionesParaCalif.length === 0) {
    print("No hay inscripciones en la base de datos.");
    print("Ejecuta primero el bloque de INSCRIPCIONES.\n");
} else {
    function asegurarDoubleEnRango(valor, min, max) {
        let v = Math.round(valor * 100) / 100;
        if (v < min) v = min;
        if (v > max) v = max;
        if (Number.isInteger(v) && (v + 0.01) <= max) {
            v = v + 0.01;
        }
        return v;
    }

    function generarCalificaciones(inscripciones, evaluacionesPorInsc) {
        let calificaciones = [];

        inscripciones.forEach(insc => {
            let tiposMezclados = [...TIPOS_EVALUACION].sort(() => Math.random() - 0.5);
            let tiposAsignados = tiposMezclados.slice(0, evaluacionesPorInsc);

            let porcentajeRestante = 100;
            tiposAsignados.forEach((tipo, idx) => {
                let porcentaje;
                if (idx === tiposAsignados.length - 1) {
                    porcentaje = porcentajeRestante;
                } else {
                    porcentaje = getRandomInt(10, Math.min(30, porcentajeRestante - (tiposAsignados.length - idx - 1) * 10));
                    porcentajeRestante -= porcentaje;
                }

                let calificacionObtenida = asegurarDoubleEnRango(Math.random() * 99 + 0.5, 0.01, 99.99);
                let calificacionMaxima = 100;
                let puntos = calificacionObtenida * porcentaje / 100;
                let puntosContribucion = asegurarDoubleEnRango(puntos, 0.01, 100);

                let estado = getRandomItem(ESTADOS_CALIF);
                let fechaEvaluacion = new Date(AÑO_ACTUAL, getRandomInt(0, 11), getRandomInt(1, 28));

                calificaciones.push({
                    inscripcion_id: insc._id,
                    estudiante_id: insc.estudiante_id,
                    curso_id: insc.curso_id,
                    estudiante_codigo: insc.estudiante_codigo,
                    estudiante_nombre: insc.estudiante_nombre,
                    curso_codigo: insc.curso_codigo,
                    curso_nombre: insc.curso_nombre,
                    tipo_evaluacion: tipo,
                    descripcion: `Evaluación: ${tipo}`,
                    fecha_evaluacion: fechaEvaluacion,
                    calificacion_obtenida: calificacionObtenida,
                    calificacion_maxima: calificacionMaxima,
                    porcentaje_curso: porcentaje,
                    puntos_contribucion: puntosContribucion,
                    estado: estado,
                    observaciones: "",
                    retroalimentacion: {
                        fortalezas: "Buen desempeño en clase",
                        areas_mejora: "Reforzar temas avanzados",
                        comentario_profesor: "Continúa así"
                    },
                    registrado_por: USER_ADMIN,
                    fecha_registro: new Date(),
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: USER_ADMIN,
                    updated_by: USER_ADMIN
                });
            });
        });
        return calificaciones;
    }

    print("Limpiando coleccion 'calificaciones'...");
    let deleteResultCalif = db.calificaciones.deleteMany({});
    print(`Documentos previos eliminados: ${deleteResultCalif.deletedCount}`);
    print("");

    print(`Generando ${EVALUACIONES_POR_INSC} calificaciones por inscripcion...`);
    let nuevasCalificaciones = generarCalificaciones(inscripcionesParaCalif, EVALUACIONES_POR_INSC);
    print(`Calificaciones generadas en memoria: ${nuevasCalificaciones.length}`);
    print("");

    print("Insertando documentos...");
    let insertadosCalif = 0;
    let erroresCalif = 0;
    let detallesErroresCalif = [];

    nuevasCalificaciones.forEach((cal) => {
        try {
            db.calificaciones.insertOne(cal);
            insertadosCalif++;
        } catch (e) {
            erroresCalif++;
            if (detallesErroresCalif.length < 1) {
                let errInfo = e.writeErrors ? e.writeErrors[0].err : e;
                detallesErroresCalif.push(JSON.stringify(errInfo, null, 2));
            }
        }
    });

    print("");
    print(`Calificaciones insertadas: ${insertadosCalif}`);
    print(`Errores: ${erroresCalif}`);
    print(`Total en DB: ${db.calificaciones.countDocuments()}`);

    if (detallesErroresCalif.length > 0) {
        print("");
        print("=== DETALLE DEL PRIMER ERROR ===");
        print(detallesErroresCalif[0]);
    }

    if (insertadosCalif > 0) {
        print("");
        print("Ejemplo de calificacion insertada:");
        let ejemplo = db.calificaciones.findOne();
        print(`Estudiante: ${ejemplo.estudiante_codigo} - ${ejemplo.estudiante_nombre}`);
        print(`Curso: ${ejemplo.curso_codigo} - ${ejemplo.curso_nombre}`);
        print(`Tipo: ${ejemplo.tipo_evaluacion}`);
        print(`Calificacion: ${ejemplo.calificacion_obtenida}/${ejemplo.calificacion_maxima}`);
        print(`Porcentaje del curso: ${ejemplo.porcentaje_curso}%`);
        print(`Estado: ${ejemplo.estado}`);
    }
}

// ============================================================================
// 7. COLECCION: PAGOS
// ============================================================================
// NOTA: Se generan para TODOS los estudiantes (historial financiero completo).

print("");
print("=".repeat(70));
print("7. COLECCION: PAGOS");
print("=".repeat(70) + "\n");

let contadorReciboPago = 0;

function generarNumeroReciboPago() {
    contadorReciboPago++;
    return `REC-${AÑO_ACTUAL}-${String(contadorReciboPago).padStart(5, '0')}`;
}

function asegurarDoublePago(valor, min) {
    let v = Math.round(valor * 100) / 100;
    if (v < min) v = min + 0.01;
    if (Number.isInteger(v)) v = v + 0.01;
    return v;
}

let estudiantesParaPagos = db.estudiantes.find(
    {},
    { _id: 1, codigo_estudiante: 1, nombre_completo: 1 }
).toArray();

print(`Estudiantes disponibles (todos): ${estudiantesParaPagos.length}`);
print("");

if (estudiantesParaPagos.length === 0) {
    print("No hay estudiantes en la base de datos.");
    print("Ejecuta primero el bloque de ESTUDIANTES.\n");
} else {
    function generarPagos(estudiantes, pagosPorEstudiante) {
        let pagos = [];

        estudiantes.forEach(est => {
            for (let p = 0; p < pagosPorEstudiante; p++) {
                let tipo = getRandomItem(TIPOS_PAGO);
                let concepto = getRandomItem(CONCEPTOS_PAGO[tipo]);
                let estado = getRandomItem(ESTADOS_PAGO);
                let metodoPago = getRandomItem(METODOS_PAGO);

                let subtotal = asegurarDoublePago(Math.random() * 7500 + 500, 0);
                let descuento = Math.random() > 0.7 ? asegurarDoublePago(Math.random() * 500, 0) : 0.01;
                let recargo = estado === "vencido" ? asegurarDoublePago(Math.random() * 250 + 50, 0) : 0.01;
                let total = subtotal - descuento + recargo;
                if (total < 0.01) total = 0.01;
                total = asegurarDoublePago(total, 0);

                let año = AÑO_ACTUAL;
                let mesIdx = getRandomInt(0, 11);
                let mes = MESES_PAGO[mesIdx];
                let ciclo = getRandomItem(CICLOS);

                let fechaVencimiento = new Date(año, mesIdx, getRandomInt(1, 28));
                let fechaPago = null;
                if (estado === "pagado") {
                    fechaPago = new Date(año, mesIdx, getRandomInt(1, 28));
                }

                let detallesPago = null;
                if (estado === "pagado") {
                    if (metodoPago === "tarjeta") {
                        detallesPago = {
                            banco: getRandomItem(BANCOS_PAGO),
                            referencia: `TXN${getRandomInt(100000, 999999)}`,
                            fecha_transaccion: fechaPago,
                            autorizacion: String(getRandomInt(100000, 999999)),
                            ultimos_4_digitos: String(getRandomInt(1000, 9999)).padStart(4, '0')
                        };
                    } else if (metodoPago === "transferencia") {
                        detallesPago = {
                            banco: getRandomItem(BANCOS_PAGO),
                            referencia: `TRF${getRandomInt(100000, 999999)}`,
                            fecha_transaccion: fechaPago
                        };
                    } else if (metodoPago === "oxxo") {
                        detallesPago = {
                            referencia_oxxo: String(getRandomInt(1000000000, 9999999999))
                        };
                    } else {
                        detallesPago = {};
                    }
                }

                let factura = {
                    requiere_factura: Math.random() > 0.7
                };
                if (factura.requiere_factura) {
                    factura.rfc = "GARL850101HDF";
                    factura.razon_social = "Persona Fisica";
                    factura.uso_cfdi = "G01";
                    factura.uuid = "00000000-0000-0000-0000-" + String(getRandomInt(100000000000, 999999999999));
                    factura.fecha_timbrado = new Date();
                    factura.xml_url = `https://facturas.academia.edu.mx/${est.codigo_estudiante}.xml`;
                    factura.pdf_url = `https://facturas.academia.edu.mx/${est.codigo_estudiante}.pdf`;
                }

                pagos.push({
                    numero_recibo: generarNumeroReciboPago(),
                    estudiante_id: est._id,
                    estudiante_codigo: est.codigo_estudiante,
                    estudiante_nombre: est.nombre_completo,
                    concepto: concepto,
                    tipo: tipo,
                    periodo: {
                        año: año,
                        mes: mes,
                        ciclo: ciclo
                    },
                    subtotal: subtotal,
                    descuento: descuento,
                    recargo: recargo,
                    total: total,
                    moneda: "MXN",
                    metodo_pago: metodoPago,
                    detalles_pago: detallesPago,
                    estado: estado,
                    fecha_pago: fechaPago,
                    fecha_vencimiento: fechaVencimiento,
                    factura: factura,
                    registrado_por: USER_ADMIN,
                    comprobante_url: estado === "pagado" ? `https://recibos.academia.edu.mx/${est.codigo_estudiante}.pdf` : "",
                    observaciones: "",
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: USER_ADMIN,
                    updated_by: USER_ADMIN
                });
            }
        });
        return pagos;
    }

    print("Limpiando coleccion 'pagos'...");
    let deleteResultPagos = db.pagos.deleteMany({});
    print(`Documentos previos eliminados: ${deleteResultPagos.deletedCount}`);
    print("");

    print(`Generando ${PAGOS_POR_ESTUDIANTE} pagos por estudiante...`);
    let nuevosPagos = generarPagos(estudiantesParaPagos, PAGOS_POR_ESTUDIANTE);
    print(`Pagos generados en memoria: ${nuevosPagos.length}`);
    print("");

    print("Insertando documentos...");
    let insertadosPagos = 0;
    let erroresPagos = 0;
    let detallesErroresPagos = [];

    nuevosPagos.forEach((pago) => {
        try {
            db.pagos.insertOne(pago);
            insertadosPagos++;
        } catch (e) {
            erroresPagos++;
            if (detallesErroresPagos.length < 1) {
                let errInfo = e.writeErrors ? e.writeErrors[0].err : e;
                detallesErroresPagos.push(JSON.stringify(errInfo, null, 2));
            }
        }
    });

    print("");
    print(`Pagos insertados: ${insertadosPagos}`);
    print(`Errores: ${erroresPagos}`);
    print(`Total en DB: ${db.pagos.countDocuments()}`);

    if (detallesErroresPagos.length > 0) {
        print("");
        print("=== DETALLE DEL PRIMER ERROR ===");
        print(detallesErroresPagos[0]);
    }

    if (insertadosPagos > 0) {
        print("");
        print("Ejemplo de pago insertado:");
        let ejemplo = db.pagos.findOne();
        print(`Recibo: ${ejemplo.numero_recibo}`);
        print(`Estudiante: ${ejemplo.estudiante_codigo}`);
        print(`Concepto: ${ejemplo.concepto}`);
        print(`Total: ${ejemplo.total} ${ejemplo.moneda}`);
        print(`Estado: ${ejemplo.estado}`);
        print(`Metodo: ${ejemplo.metodo_pago}`);
    }
}

// ============================================================================
// RESUMEN FINAL
// ============================================================================
print("");
print("=".repeat(70));
print("RESUMEN FINAL");
print("=".repeat(70));
print(`Estudiantes:    ${db.estudiantes.countDocuments()}`);
print(`  - Activos:    ${db.estudiantes.countDocuments({ estado: "activo" })}`);
print(`  - Inactivos:  ${db.estudiantes.countDocuments({ estado: "inactivo" })}`);
print(`  - Egresados:  ${db.estudiantes.countDocuments({ estado: "egresado" })}`);
print(`  - Retirados:  ${db.estudiantes.countDocuments({ estado: "retirado" })}`);
print(`  - Suspendidos: ${db.estudiantes.countDocuments({ estado: "suspendido" })}`);
print(`Profesores:     ${db.profesores.countDocuments()}`);
print(`  - Activos:    ${db.profesores.countDocuments({ estado: "activo" })}`);
print(`Cursos:         ${db.cursos.countDocuments()}`);
print(`Asistencias:    ${db.asistencias.countDocuments()}`);
print(`Inscripciones:  ${db.inscripciones.countDocuments()}`);
print(`Calificaciones: ${db.calificaciones.countDocuments()}`);
print(`Pagos:          ${db.pagos.countDocuments()}`);
print("=".repeat(70));
print("");