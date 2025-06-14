export function getDistanceBetweenCoordinates(lat1, lon1, lat2, lon2) {
  // Retorna distância em metros
  const R = 6371e3; // Raio da Terra em metros
  const toRadians = (deg) => deg * (Math.PI / 180);

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distância em metros
}

export function generateInterpolatedPoints(
  points,
  maxDistance = 0.07,
  density = 5
) {
  if (points.length < 2) return points;

  const newPoints = [...points];
  const gridSize = maxDistance; // O tamanho da célula da grade é a própria distância
  const grid = {};

  // 1. Coloca cada ponto em uma célula da grade
  for (const p of points) {
    const gridX = Math.floor(p.longitude / gridSize);
    const gridY = Math.floor(p.latitude / gridSize);
    const key = `${gridX},${gridY}`;
    if (!grid[key]) {
      grid[key] = [];
    }
    grid[key].push(p);
  }

  // 2. Itera sobre os pontos e compara apenas com os vizinhos próximos
  for (const p1 of points) {
    const gridX = Math.floor(p1.longitude / gridSize);
    const gridY = Math.floor(p1.latitude / gridSize);

    // Itera sobre a célula do ponto atual e as 8 células vizinhas
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gridX + dx},${gridY + dy}`;
        if (grid[key]) {
          for (const p2 of grid[key]) {
            // Evita comparar um ponto com ele mesmo ou recalcular pares
            if (p1 === p2 || p1.latitude > p2.latitude) continue;

            const latDiff = p1.latitude - p2.latitude;
            const lonDiff = p1.longitude - p2.longitude;
            const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

            if (distance < maxDistance) {
              for (let k = 1; k <= density; k++) {
                const t = k / (density + 1);
                newPoints.push({
                  latitude: p1.latitude * (1 - t) + p2.latitude * t,
                  longitude: p1.longitude * (1 - t) + p2.longitude * t,
                  weight: 1
                });
              }
            }
          }
        }
      }
    }
  }

  return newPoints;
}

export function limitPoints(points, limit = 15000) {
  if (points.length <= limit) {
    return points;
  }

  const result = [];
  const len = points.length;
  const taken = new Array(len);

  // Garante que o loop não se torne infinito se o limite for maior que o tamanho
  const numToTake = Math.min(limit, len);

  while (result.length < numToTake) {
    const x = Math.floor(Math.random() * len);
    if (!taken[x]) {
      result.push(points[x]);
      taken[x] = true;
    }
  }
  return result;
}
