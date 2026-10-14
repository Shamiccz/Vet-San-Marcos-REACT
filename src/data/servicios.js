// Catálogo de servicios de la clínica. Duración en minutos.
export const SERVICIOS = [
  {
    "id": "SV001",
    "categoria": "Consultas",
    "nombre": "Consulta general",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 30,
    "precio": 15000,
    "observaciones": ""
  },
  {
    "id": "SV002",
    "categoria": "Consultas",
    "nombre": "Consulta urgencia",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 30,
    "precio": 25000,
    "observaciones": "Fuera de horario +$10.000"
  },
  {
    "id": "SV003",
    "categoria": "Consultas",
    "nombre": "Control postoperatorio",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 20,
    "precio": 10000,
    "observaciones": ""
  },
  {
    "id": "SV004",
    "categoria": "Consultas",
    "nombre": "Consulta ave / conejo",
    "especies": [
      "Ave",
      "Conejo"
    ],
    "duracionMin": 30,
    "precio": 18000,
    "observaciones": ""
  },
  {
    "id": "SV005",
    "categoria": "Consultas",
    "nombre": "Segunda opinión médica",
    "especies": [
      "Perro",
      "Gato",
      "Conejo",
      "Ave"
    ],
    "duracionMin": 40,
    "precio": 20000,
    "observaciones": "Requiere ficha previa"
  },
  {
    "id": "VA001",
    "categoria": "Vacunación",
    "nombre": "Vacuna antirrábica canina",
    "especies": [
      "Perro"
    ],
    "duracionMin": 10,
    "precio": 12000,
    "observaciones": "Obligatoria por ley"
  },
  {
    "id": "VA002",
    "categoria": "Vacunación",
    "nombre": "Vacuna sextuple canina",
    "especies": [
      "Perro"
    ],
    "duracionMin": 10,
    "precio": 18000,
    "observaciones": "Refuerzo anual"
  },
  {
    "id": "VA003",
    "categoria": "Vacunación",
    "nombre": "Vacuna bivalente felina",
    "especies": [
      "Gato"
    ],
    "duracionMin": 10,
    "precio": 15000,
    "observaciones": "Refuerzo anual"
  },
  {
    "id": "VA004",
    "categoria": "Vacunación",
    "nombre": "Vacuna triple felina",
    "especies": [
      "Gato"
    ],
    "duracionMin": 10,
    "precio": 17000,
    "observaciones": "Refuerzo anual"
  },
  {
    "id": "VA005",
    "categoria": "Vacunación",
    "nombre": "Vacuna Bordetella canina",
    "especies": [
      "Perro"
    ],
    "duracionMin": 10,
    "precio": 14000,
    "observaciones": "Tos de las perreras"
  },
  {
    "id": "VA006",
    "categoria": "Vacunación",
    "nombre": "Vacuna antirrábica felina",
    "especies": [
      "Gato"
    ],
    "duracionMin": 10,
    "precio": 12000,
    "observaciones": ""
  },
  {
    "id": "CI001",
    "categoria": "Cirugía",
    "nombre": "Esterilización hembra canina",
    "especies": [
      "Perro"
    ],
    "duracionMin": 90,
    "precio": 80000,
    "observaciones": "Incluye anestesia y hospitalización 24h"
  },
  {
    "id": "CI002",
    "categoria": "Cirugía",
    "nombre": "Esterilización macho canino",
    "especies": [
      "Perro"
    ],
    "duracionMin": 60,
    "precio": 60000,
    "observaciones": "Incluye anestesia"
  },
  {
    "id": "CI003",
    "categoria": "Cirugía",
    "nombre": "Esterilización hembra felina",
    "especies": [
      "Gato"
    ],
    "duracionMin": 60,
    "precio": 65000,
    "observaciones": "Incluye anestesia y hospitalización 12h"
  },
  {
    "id": "CI004",
    "categoria": "Cirugía",
    "nombre": "Esterilización macho felino",
    "especies": [
      "Gato"
    ],
    "duracionMin": 45,
    "precio": 50000,
    "observaciones": "Incluye anestesia"
  },
  {
    "id": "CI005",
    "categoria": "Cirugía",
    "nombre": "Extirpación de tumor cutáneo",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 60,
    "precio": 120000,
    "observaciones": "Precio referencial; varía según tamaño"
  },
  {
    "id": "CI006",
    "categoria": "Cirugía",
    "nombre": "Cesárea de urgencia",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 120,
    "precio": 180000,
    "observaciones": ""
  },
  {
    "id": "DE001",
    "categoria": "Desparasitación",
    "nombre": "Desparasitación interna pequeños (<10 kg)",
    "especies": [
      "Perro"
    ],
    "duracionMin": 5,
    "precio": 8000,
    "observaciones": ""
  },
  {
    "id": "DE002",
    "categoria": "Desparasitación",
    "nombre": "Desparasitación interna medianos (10-25 kg)",
    "especies": [
      "Perro"
    ],
    "duracionMin": 5,
    "precio": 9500,
    "observaciones": ""
  },
  {
    "id": "DE003",
    "categoria": "Desparasitación",
    "nombre": "Desparasitación interna grandes (>25 kg)",
    "especies": [
      "Perro"
    ],
    "duracionMin": 5,
    "precio": 11000,
    "observaciones": ""
  },
  {
    "id": "DE004",
    "categoria": "Desparasitación",
    "nombre": "Desparasitación interna felina",
    "especies": [
      "Gato"
    ],
    "duracionMin": 5,
    "precio": 8000,
    "observaciones": ""
  },
  {
    "id": "DE005",
    "categoria": "Desparasitación",
    "nombre": "Antiparasitario externo (pipeta)",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 5,
    "precio": 7500,
    "observaciones": "Incluye aplicación"
  },
  {
    "id": "EX001",
    "categoria": "Exámenes",
    "nombre": "Hemograma completo",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 30,
    "precio": 22000,
    "observaciones": "Resultado en 24-48 h"
  },
  {
    "id": "EX002",
    "categoria": "Exámenes",
    "nombre": "Perfil bioquímico completo",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 30,
    "precio": 35000,
    "observaciones": "Resultado en 24-48 h"
  },
  {
    "id": "EX003",
    "categoria": "Exámenes",
    "nombre": "Radiografía (1 proyección)",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 20,
    "precio": 28000,
    "observaciones": ""
  },
  {
    "id": "EX004",
    "categoria": "Exámenes",
    "nombre": "Ecografía abdominal",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 30,
    "precio": 45000,
    "observaciones": ""
  },
  {
    "id": "EX005",
    "categoria": "Exámenes",
    "nombre": "Test de leishmaniasis",
    "especies": [
      "Perro"
    ],
    "duracionMin": 20,
    "precio": 18000,
    "observaciones": ""
  },
  {
    "id": "OT001",
    "categoria": "Otros",
    "nombre": "Corte de uñas",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 15,
    "precio": 5000,
    "observaciones": ""
  },
  {
    "id": "OT002",
    "categoria": "Otros",
    "nombre": "Limpieza dental",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 45,
    "precio": 55000,
    "observaciones": "Requiere anestesia"
  },
  {
    "id": "OT003",
    "categoria": "Otros",
    "nombre": "Microchip identificación",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 10,
    "precio": 15000,
    "observaciones": "Incluye registro"
  },
  {
    "id": "OT004",
    "categoria": "Otros",
    "nombre": "Hospitalización (por día)",
    "especies": [
      "Perro",
      "Gato"
    ],
    "duracionMin": 1440,
    "precio": 30000,
    "observaciones": "Incluye monitoreo y alimentación básica"
  }
];
