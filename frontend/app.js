const apiUrl = 'http://localhost:3000';

// ---------------- PROPIETARIOS ----------------
const formProp = document.getElementById('formPropietario');
const listaProp = document.getElementById('listaPropietarios');

formProp.addEventListener('submit', async e => {
    e.preventDefault();

    const nombre = document.getElementById('nombrePropietario').value.trim();
    const telefono = document.getElementById('telefonoPropietario').value.trim();
    const email = document.getElementById('emailPropietario').value.trim();

    // Validaciones
    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }
    if (!telefono) {
        alert('El teléfono es obligatorio');
        return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        alert('Email no válido');
        return;
    }

    if (formProp.dataset.editId) {
        const id = formProp.dataset.editId;
        await fetch(`${apiUrl}/propietarios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, telefono, email })
        });
        delete formProp.dataset.editId;
    } else {
        await fetch(`${apiUrl}/propietarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, telefono, email })
        });
    }

    formProp.reset();
    cargarPropietarios();
});

async function cargarPropietarios() {
    const res = await fetch(`${apiUrl}/propietarios`);
    const data = await res.json();
    listaProp.innerHTML = '';

    data.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${p.id} - ${p.nombre} 
            | 📞 ${p.telefono} 
            | 📧 ${p.email}
            <button onclick="editarProp(${p.id}, '${p.nombre}', '${p.telefono}', '${p.email}')">Editar</button>
            <button onclick="eliminarProp(${p.id})">Eliminar</button>
        `;
        listaProp.appendChild(li);
    });
}

window.editarProp = (id, nombre, telefono, email) => {
    document.getElementById('nombrePropietario').value = nombre;
    document.getElementById('telefonoPropietario').value = telefono;
    document.getElementById('emailPropietario').value = email;
    formProp.dataset.editId = id;
};

window.eliminarProp = async (id) => {
    if (confirm('¿Eliminar propietario?')) {
        await fetch(`${apiUrl}/propietarios/${id}`, {
            method: 'DELETE'
        });
        cargarPropietarios();
    }
};

cargarPropietarios();


// ---------------- MASCOTAS ----------------
const formMasc = document.getElementById('formMascota');
const listaMasc = document.getElementById('listaMascotas');

formMasc.addEventListener('submit', async e => {
    e.preventDefault();

    const nombre = document.getElementById('nombreMascota').value.trim();
    const especie = document.getElementById('especieMascota').value.trim();
    const edad = parseInt(document.getElementById('edadMascota').value);
    const propietario_id = parseInt(document.getElementById('propietarioIdMascota').value);

    // Validaciones
    if (!nombre) {
        alert('El nombre de la mascota es obligatorio');
        return;
    }
    if (!especie) {
        alert('La especie es obligatoria');
        return;
    }
    if (isNaN(edad) || edad < 0) {
        alert('Edad no válida');
        return;
    }
    if (isNaN(propietario_id) || propietario_id <= 0) {
        alert('ID de propietario no válido');
        return;
    }

    if (formMasc.dataset.editId) {
        const id = formMasc.dataset.editId;
        await fetch(`${apiUrl}/mascotas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, especie, edad, propietario_id })
        });
        delete formMasc.dataset.editId;
    } else {
        await fetch(`${apiUrl}/mascotas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, especie, edad, propietario_id })
        });
    }

    formMasc.reset();
    cargarMascotas();
});

async function cargarMascotas() {
    // Traemos todas las mascotas
    const resMasc = await fetch(`${apiUrl}/mascotas`);
    const dataMasc = await resMasc.json();

    // Traemos todos los propietarios para relacionar nombre con ID
    const resProp = await fetch(`${apiUrl}/propietarios`);
    const dataProp = await resProp.json();

    listaMasc.innerHTML = '';

    dataMasc.forEach(m => {
        // Buscar propietario de la mascota
        const propietario = dataProp.find(p => p.id === m.propietario_id);
        const nombreProp = propietario ? propietario.nombre : 'Desconocido';

        const li = document.createElement('li');
        li.innerHTML = `
            ${m.id} - ${m.nombre} (${m.especie}) 
            | Edad: ${m.edad} ${m.edad === 1 ? 'año' : 'años'}
            | Propietario: ${nombreProp}
            <button onclick="editarMasc(${m.id}, '${m.nombre}', '${m.especie}', ${m.edad}, ${m.propietario_id})">Editar</button>
            <button onclick="eliminarMasc(${m.id})">Eliminar</button>
        `;
        listaMasc.appendChild(li);
    });
}

window.editarMasc = (id, nombre, especie, edad, propietario_id) => {
    document.getElementById('nombreMascota').value = nombre;
    document.getElementById('especieMascota').value = especie;
    document.getElementById('edadMascota').value = edad;
    document.getElementById('propietarioIdMascota').value = propietario_id;
    formMasc.dataset.editId = id;
};

window.eliminarMasc = async (id) => {
    if (confirm('¿Eliminar mascota?')) {
        await fetch(`${apiUrl}/mascotas/${id}`, {
            method: 'DELETE'
        });
        cargarMascotas();
    }
};

cargarMascotas();




