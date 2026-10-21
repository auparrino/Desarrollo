# La mejor combinación posible de prioridades (modo simple)

Antes, el modo simple pedía repartir 10 puntos entre los temas que no son obligatorios. Eso obligaba a
elegir qué resignar, cuando lo que se busca siempre es la mejor combinación posible. Ahora el reparto
se hace solo (`web/src/model/combinacion.ts`):

1. **Lo que se exige siempre** (agua, seguridad y clima) conserva el peso de la bibliografía, y las
   zonas que no cumplen las restricciones quedan afuera.
2. **El resto de los temas se reparte al azar 300 veces**, cubriendo de manera uniforme todas las
   combinaciones posibles: desde darle todo a un solo tema hasta repartir por igual (Dirichlet(1, …, 1)
   sobre los temas; dentro de cada tema, los pesos de la bibliografía). Los temas son conexión,
   descentralización, trabajo, tierra pública, energía, terreno y los que correspondan a cada
   instrumento.
3. **Cada zona se mide por la fracción de combinaciones en las que queda dentro del 5 % mejor.** Arriba
   quedan las que ganan con cualquier prioridad razonable, no con una sola. El empate se rompe con el
   puntaje que da a todos los temas el mismo peso.

Es el enfoque del análisis de aceptabilidad estocástica multicriterio (SMAA; Lahdelma, Hokkanen y
Salminen 1998) y del análisis de sensibilidad de pesos de Ligmann-Zielinska y Jankowski (2014). Cada
tarjeta muestra "sale entre los mejores en el X % de las combinaciones de prioridades".

El modo experto conserva los pesos editables para quien quiera fijarlos a mano. Los scripts
`web/scripts/casos.ts` y `web/scripts/simular.ts` eligen los casos con este mismo criterio.

Con este criterio cambian los casos de cada instrumento:

| Instrumento | Lugar |
|---|---|
| Ciudad nueva | Sarmiento (Deseado, Santa Cruz) |
| Capital | Senillosa (El Cuy, Río Negro) |
| Ciudad intermedia | Gran San Nicolás de los Arroyos |
| Pueblo | Punta Alta |
| Polo | Laguna Brava (Capital, Corrientes) |
