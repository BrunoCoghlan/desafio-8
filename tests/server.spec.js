const request = require("supertest");
const server = require("../index");

const cafePrueba = { id: Math.floor(Math.random() * 999999), nombre: "este no es un cafe" }
const cafePrueba1 = { id: Math.floor(Math.random() * 999999), nombre: "es un té" }
describe("Operaciones CRUD de cafes", () => {
    test('Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo con por lo menos 1 objeto.', async () => {
        const response = await request(server).get('/cafes').send()
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })
    test('Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe.', async () => {
        const response = await request(server).delete('/cafes/fake_id').set('Authorization', 'fake-token').send()
        expect(response.status).toBe(404)
    })
    test('Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201.', async () => {
        const response = await request(server).post('/cafes').send(cafePrueba)
        expect(response.status).toBe(201)
    })
    test('Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un café enviando un id en los parámetros que sea diferente al id dentro del payload', async () => {
        const response = await request(server).put('/cafes/fake_id').send(cafePrueba)
        expect(response.status).toBe(400)
    })
    // extras
    test('Testiando ruta por defecto /*', async () => {
        const response = await request(server).get('/fake_ruta').send()
        expect(response.status).toBe(404)
        expect(typeof response.body.message).toBe('string')
    })
    test('Testiando ruta GET con id falso entrega un status 404 y un objeto con la propiedad message que contiene un string', async () => {
        const response = await request(server).get('/cafes/fake_id').send()
        expect(response.status).toBe(404)
        expect(typeof response.body.message).toBe('string')
    })
    test('Testiando ruta GET con id verdadero entrega un status 200 y un arreglo con 1 objeto con un nombre = string y un id = numero', async () => {
        const response = await request(server).get('/cafes/1').send()
        expect(response.status).toBe(200)
        expect(typeof response.body.nombre).toBe('string')
        expect(typeof response.body.id).toBe('number')
    })
    test('Comprueba que se obtiene un código 400 al intentar eliminar un café sin el header Authorization ', async () => {
        const response = await request(server).delete('/cafes/fake_id').send()
        expect(response.status).toBe(400)
    })
    test('Comprueba que se obtiene un arreglo con al menos 1 objeto al eliminar un café con un id correcto y header', async () => {
        const response = await request(server).delete('/cafes/1').set('Authorization', 'fake-token').send()
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })
    test('Prueba que la ruta POST /cafes agrega que ya exista, se espera un status 200 y un message con un string', async () => {
        const response = await request(server).post('/cafes').send(cafePrueba)
        expect(response.status).toBe(400)
        expect(typeof response.body.message).toBe('string')
    })
    test('Prueba que la ruta PUT /cafes enviando un id correcto, debe devolver un array con almenos un objeto.', async () => {
        const response = await request(server).put(`/cafes/${cafePrueba.id}`).send(cafePrueba)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(1)

    })
    test('Prueba que la ruta PUT /cafes enviando un id incorrecto, debe devolver un statuscode 404.', async () => {
        const response = await request(server).put(`/cafes/${cafePrueba1.id}`).send(cafePrueba1)
        expect(response.status).toBe(404)

    })

});
