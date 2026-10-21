// Lo que conviene hacer, según las simulaciones de proceso (docs/simulaciones-procesos.md)
// y los recorridos de ciudades que funcionaron (docs/recorridos-exitosos.md).

export const PRINCIPIOS: { titulo: string; texto: string }[] = [
  {
    titulo: "Primero la conexión, después el empleo, después las viviendas",
    texto: "En todos los casos que funcionaron el Estado hizo antes la infraestructura (ruta, agua, energía, puerto) y el empleo masivo llegó de 1 a 8 años después. La vivienda se construye a medida que llega la gente.",
  },
  {
    titulo: "No construir la ciudad por adelantado",
    texto: "\"Viviendas primero\" es siempre la peor estrategia simulada: la gente no llega por haber casas, llega si hay trabajo, y las viviendas vacías cuestan.",
  },
  {
    titulo: "El empleo pone el ritmo",
    texto: "Sin un motor de empleo, un lugar nuevo crece como mucho al ritmo del flujo migratorio habitual, y donde el empleo de la zona no crece no llega nadie. Cada empleo del motor sostiene entre 1,6 y 1,9 empleos más (Tierra del Fuego, Canberra).",
  },
  {
    titulo: "El motor más barato es público y permanente",
    texto: "Organismos, universidad u hospitales regionales cuestan una vez (unos USD 23.000 por puesto). Los incentivos fiscales por empleo al nivel de los regímenes de promoción (USD 51.000 por puesto por año) no se pagan en ningún caso simulado.",
  },
  {
    titulo: "Que las familias se muden, no que viajen",
    texto: "Si el traslado va más rápido que la vivienda y las escuelas, los empleados viajan en lugar de radicarse (Sejong, Putrajaya, Añelo). Conviene trasladar de a un organismo por vez, con vivienda y ayuda de mudanza.",
  },
  {
    titulo: "Metas realistas",
    texto: "Los mejores recorridos argentinos (Puerto Madryn, Tierra del Fuego, Neuquén) sumaron entre 50.000 y 125.000 personas en 30 años, con 1 a 2,3 veces el mayor saldo migratorio reciente del país. Una ciudad de 500.000 habitantes en 30 años no tiene antecedente en la Argentina.",
  },
  {
    titulo: "Atraer a quienes ya conocen la región",
    texto: "La gente se muda por corredores que ya existen, donde fueron parientes y conocidos, y uno de cada tres migrantes vuelve a su provincia de nacimiento. Los programas de retorno y la difusión en la propia región rinden más que buscar gente lejos.",
  },
];
