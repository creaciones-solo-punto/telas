const telasPorCategoria = {
    nina: [
        { nombre: "Bluey",          codigo: "M-001", archivo: "Bluey-01.jpeg" },
        { nombre: "Cinnamoroll",    codigo: "M-002", archivo: "Cinnamon-01.jpeg" },
        { nombre: "Flores",         codigo: "M-003", archivo: "Flores-01.jpeg" },
        { nombre: "Mariquitas",     codigo: "M-004", archivo: "Flores-02.jpeg" },
        { nombre: "Conejitos",      codigo: "M-005", archivo: "Flores-03.jpeg" },
        { nombre: "Hello Kitty",    codigo: "M-006", archivo: "HelloKitty-01.jpeg" },
        { nombre: "Minnie Mouse",   codigo: "M-008", archivo: "Minnie-02.jpeg" },
        { nombre: "Minnie Mouse",   codigo: "M-009", archivo: "Minnie-03.jpeg" },
        { nombre: "Princesas",      codigo: "M-010", archivo: "Princesas-01.jpeg" },
        { nombre: "Ariel",          codigo: "M-011", archivo: "Sirena-01.jpeg" },
        { nombre: "Winnie Pooh",    codigo: "M-012", archivo: "WinniePooh-01.jpeg" },
        { nombre: "Flores",         codigo: "M-013", archivo: "Flores 04.jpeg" },
        { nombre: "Ariel",          codigo: "M-014", archivo: "Ariel 01.jpeg" },
        { nombre: "Guerreras K-Pop",          codigo: "M-015", archivo: "Kpop 01.jpeg" },
        { nombre: "Masha y el Oso", codigo: "M-016", archivo: "Masha y el Oso 01.jpeg" }
    ],

    nino: [
        { nombre: "Dinosaurios",    codigo: "H-001", archivo: "Dino 01.jpeg" },
        { nombre: "Animalitos",     codigo: "H-002", archivo: "Animalitos 01.jpeg" },
        { nombre: "Mickey Mouse",   codigo: "H-003", archivo: "Mickey 01.jpeg" },
        { nombre: "Liga Alajuelense",         codigo: "H-004", archivo: "Liga.jpeg" },
        { nombre: "Cars",           codigo: "H-005", archivo: "Cars 01.jpeg" },
        { nombre: "Pollitos",       codigo: "H-006", archivo: "Pollitos 01.jpeg" },
        { nombre: "Mickey Mouse",   codigo: "H-007", archivo: "Mickey 02.jpeg" },
        { nombre: "Dragon Ball",           codigo: "H-008", archivo: "Goku 01.jpeg" },
        { nombre: "Mickey Mouse",   codigo: "H-009", archivo: "Mickey 04.jpeg" },
        { nombre: "Mario Bros",     codigo: "H-010", archivo: "Mario 02.jpeg" },
        { nombre: "Blaze",          codigo: "H-011", archivo: "Blaze 01.jpeg" },
        { nombre: "Mario Bros",     codigo: "H-012", archivo: "Mario 01.jpeg" },
        { nombre: "Sonic",          codigo: "H-013", archivo: "Sonic 01.jpeg" },
        { nombre: "Pokémon",        codigo: "H-014", archivo: "Pokemon 01.jpeg" },
        { nombre: "Dinosaurios",    codigo: "H-015", archivo: "Dino 03.jpeg" },
        { nombre: "Dinosaurios",    codigo: "H-016", archivo: "Dino 02.jpeg" },
        { nombre: "Plim Plim",      codigo: "H-017", archivo: "Plim Plim 01.jpeg" },
        { nombre: "Mickey Mouse",   codigo: "H-018", archivo: "Mickey 03.jpeg" },
        { nombre: "Cars",           codigo: "H-019", archivo: "Cars 02.jpeg" },
        { nombre: "Bluey",          codigo: "H-020", archivo: "Bluey 02.jpeg" },
        { nombre: "Paw Patrol",     codigo: "H-021", archivo: "Paw Patrol 01.jpeg" }
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
