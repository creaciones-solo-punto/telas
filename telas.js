const telasPorCategoria = {
    nina: [
        { nombre: "Bluey",        codigo: "CS-001", archivo: "Bluey-01.jpeg" },
        { nombre: "Cinnamoroll",  codigo: "CS-002", archivo: "Cinnamon-01.jpeg" },
        { nombre: "Flores",       codigo: "CS-003", archivo: "Flores-01.jpeg" },
        { nombre: "Mariquitas",   codigo: "CS-004", archivo: "Flores-02.jpeg" },
        { nombre: "Conejitos",    codigo: "CS-005", archivo: "Flores-03.jpeg" },
        { nombre: "Hello Kitty",  codigo: "CS-006", archivo: "HelloKitty-01.jpeg" },
        { nombre: "Minnie",       codigo: "CS-007", archivo: "Minnie-01.jpeg" },
        { nombre: "Minnie",       codigo: "CS-008", archivo: "Minnie-02.jpeg" },
        { nombre: "Minnie",       codigo: "CS-009", archivo: "Minnie-03.jpeg" },
        { nombre: "Princesas",    codigo: "CS-010", archivo: "Princesas-01.jpeg" },
        { nombre: "Sirena",       codigo: "CS-011", archivo: "Sirena-01.jpeg" },
        { nombre: "Winnie Pooh",  codigo: "CS-012", archivo: "WinniePooh-01.jpeg" }
    ],
    nino: [
    ],
    navidad: [
    ]
};

const categorias = {
    todas:   "Todas",
    nina:    "Niña",
    nino:    "Niño",
    navidad: "Navidad"
};

const telas = [];
Object.keys(telasPorCategoria).forEach(categoria => {
    telasPorCategoria[categoria].forEach(tela => {
        telas.push({
            nombre: tela.nombre,
            codigo: tela.codigo,
            imagen: "imagenes/" + tela.archivo,
            categoria: categoria
        });
    });
});

const catalogo = document.getElementById("catalogo");
const filtros = document.getElementById("filtros");
const buscador = document.getElementById("buscador");
const vacio = document.getElementById("vacio");
const visor = document.getElementById("visor");
const visorImg = document.getElementById("visor-img");
const visorNombre = document.getElementById("visor-nombre");
const visorCodigo = document.getElementById("visor-codigo");
const visorCategoria = document.getElementById("visor-categoria");

let filtroActual = "todas";
let textoBusqueda = "";

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function contar(categoria) {
    return categoria === "todas"
        ? telas.length
        : telas.filter(t => t.categoria === categoria).length;
}

function crearFiltros() {
    filtros.innerHTML = "";
    Object.keys(categorias).forEach(clave => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "filtro" + (clave === filtroActual ? " activo" : "");
        boton.innerHTML =
            `${categorias[clave]}<span class="cantidad">(${contar(clave)})</span>`;
        boton.addEventListener("click", () => {
            filtroActual = clave;
            crearFiltros();
            mostrarTelas();
        });
        filtros.appendChild(boton);
    });
}

function mostrarTelas() {
    catalogo.innerHTML = "";

    const busqueda = normalizar(textoBusqueda);

    const lista = telas.filter(tela => {
        const coincideCategoria =
            filtroActual === "todas" || tela.categoria === filtroActual;
        const coincideBusqueda =
            busqueda === "" ||
            normalizar(tela.nombre).includes(busqueda) ||
            normalizar(tela.codigo).includes(busqueda);
        return coincideCategoria && coincideBusqueda;
    });

    if (lista.length === 0) {
        vacio.hidden = false;
        vacio.textContent = busqueda
            ? `No encontramos telas para "${textoBusqueda.trim()}".`
            : `Próximamente más telas en ${categorias[filtroActual]}.`;
        return;
    }

    vacio.hidden = true;

    lista.forEach(tela => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tela";

        tarjeta.innerHTML = `
            <div class="foto">
                <img src="${tela.imagen}" alt="${tela.nombre}" loading="lazy">
            </div>
            <div class="informacion">
                <h3>${tela.nombre}</h3>
                <span class="codigo">${tela.codigo}</span>
            </div>
        `;

        tarjeta.addEventListener("click", () => abrirVisor(tela));
        catalogo.appendChild(tarjeta);
    });
}

function abrirVisor(tela) {
    visorImg.src = tela.imagen;
    visorImg.alt = tela.nombre;
    visorNombre.textContent = tela.nombre;
    visorCodigo.textContent = tela.codigo;
    visorCategoria.textContent = categorias[tela.categoria];
    visor.hidden = false;
}

function cerrarVisor() {
    visor.hidden = true;
}

buscador.addEventListener("input", () => {
    textoBusqueda = buscador.value;
    mostrarTelas();
});

visor.addEventListener("click", e => {
    if (e.target === visor || e.target.classList.contains("visor-cerrar")) {
        cerrarVisor();
    }
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") cerrarVisor();
});

crearFiltros();
mostrarTelas();