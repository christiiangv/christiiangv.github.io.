// Fragmentos que se muestran en la sección "Así escribo código".
// Edita el texto de cada "code" por el tuyo y el color se aplica solo.
// Si tu código lleva comillas invertidas (`) o ${, escríbelas como \` y \${.
const snippets = [
  {
    file: "tareas.js",
    lang: "js",
    code: `const orden = { alta: 0, media: 1, baja: 2 };

class GestorTareas {
  #tareas = JSON.parse(localStorage.getItem("tareas") ?? "[]");

  añadir(texto, prioridad = "media") {
    texto = texto.trim();
    if (!texto) throw new Error("La tarea no puede estar vacía");
    this.#tareas.unshift({ id: crypto.randomUUID(), texto, prioridad, hecha: false });
    return this.#guardar();
  }

  alternar(id) {
    const t = this.#tareas.find(t => t.id === id);
    if (t) t.hecha = !t.hecha;
    return this.#guardar();
  }

  filtrar({ estado = "todas", busca = "" } = {}) {
    return this.#tareas
      .filter(t => estado === "todas" || t.hecha === (estado === "hechas"))
      .filter(t => t.texto.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);
  }

  #guardar() {
    localStorage.setItem("tareas", JSON.stringify(this.#tareas));
    return this;
  }
}`
  },
  {
    file: "repos.js",
    lang: "js",
    code: `const cache = new Map();

async function obtenerRepos(usuario, { limite = 6 } = {}) {
  if (cache.has(usuario)) return cache.get(usuario);

  const res = await fetch(\`https://api.github.com/users/\${usuario}/repos?sort=updated\`);
  if (!res.ok) throw new Error(\`GitHub respondió \${res.status}\`);

  const repos = (await res.json())
    .filter(r => !r.fork)
    .slice(0, limite)
    .map(({ name, description, language, stargazers_count }) => ({
      name, description, language, estrellas: stargazers_count
    }));

  cache.set(usuario, repos);
  return repos;
}

obtenerRepos("christiiangv")
  .then(repos => console.table(repos))
  .catch(err => console.error("No se pudo cargar:", err.message));`
  },
  {
    file: "LibroRepository.php",
    lang: "php",
    code: `<?php
declare(strict_types=1);

final class LibroRepository
{
    public function __construct(private PDO $db) {}

    public function buscar(string $texto, int $pagina = 1, int $porPagina = 10): array
    {
        $sql = "SELECT id, titulo, autor FROM libros
                WHERE titulo LIKE :t OR autor LIKE :t
                ORDER BY titulo LIMIT :n OFFSET :o";
        $q = $this->db->prepare($sql);
        $q->bindValue(":t", "%$texto%");
        $q->bindValue(":n", $porPagina, PDO::PARAM_INT);
        $q->bindValue(":o", ($pagina - 1) * $porPagina, PDO::PARAM_INT);
        $q->execute();
        return $q->fetchAll(PDO::FETCH_ASSOC);
    }
}

$db = new PDO("mysql:host=localhost;dbname=biblioteca;charset=utf8mb4", "root", "", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

header("Content-Type: application/json");
echo json_encode((new LibroRepository($db))->buscar($_GET["q"] ?? ""));`
  },
  {
    file: "biblioteca.sql",
    lang: "sql",
    code: `-- Biblioteca: socios y préstamos
CREATE TABLE socios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) UNIQUE
);

CREATE TABLE prestamos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  socio_id INT NOT NULL,
  libro_id INT NOT NULL,
  fecha_salida DATE NOT NULL DEFAULT (CURRENT_DATE),
  fecha_devolucion DATE NULL,
  FOREIGN KEY (socio_id) REFERENCES socios(id),
  FOREIGN KEY (libro_id) REFERENCES libros(id)
);

-- Socios con préstamos sin devolver pasados 15 días
SELECT s.nombre, COUNT(*) AS retrasos
FROM prestamos p
JOIN socios s ON s.id = p.socio_id
WHERE p.fecha_devolucion IS NULL
  AND p.fecha_salida < DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY)
GROUP BY s.id
ORDER BY retrasos DESC;`
  },
  {
    file: "Gastos.java",
    lang: "java",
    code: `import java.util.*;
import java.util.stream.*;

enum Categoria { COMIDA, TRANSPORTE, OCIO, ESTUDIOS }

record Gasto(String concepto, Categoria categoria, double importe) {
  Gasto {
    if (importe <= 0) throw new IllegalArgumentException("Importe no válido");
  }
}

public class Gastos {
  private final List<Gasto> lista = new ArrayList<>();

  public void añadir(Gasto g) {
    lista.add(g);
  }

  public Map<Categoria, Double> totalPorCategoria() {
    return lista.stream().collect(Collectors.groupingBy(
        Gasto::categoria, TreeMap::new, Collectors.summingDouble(Gasto::importe)));
  }

  public Optional<Gasto> mayorGasto() {
    return lista.stream().max(Comparator.comparingDouble(Gasto::importe));
  }
}`
  },
  {
    file: "estilos.css",
    lang: "css",
    code: `/* Galería responsive con tarjetas */
:root {
  --azul: #2f3cff;
  --radio: 20px;
}

.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(12px, 2vw, 24px);
}

.tarjeta {
  padding: 1.25rem;
  border-radius: var(--radio);
  background: color-mix(in srgb, var(--azul) 8%, white);
  transition: transform .25s ease, box-shadow .25s ease;
}

.tarjeta:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 40px -24px var(--azul);
}

@media (prefers-reduced-motion: reduce) {
  .tarjeta { transition: none; }
}`
  }
];
