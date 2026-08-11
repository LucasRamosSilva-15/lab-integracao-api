process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database');

describe('Api de alunos - Testes de Integração', () => {

    beforeEach((done) => {
        db.serialize(() => {
            db.run('DELETE FROM alunos', {}, (err) => {
                if (err) return done(err);
                done();
            });
        });

    });

    afterAll((done) => {
        db.close((err) => {
            if (err) return done(err);
            done();
        });
    });

    // it('deve retornar todos os alunos', (done) => {
    //     request.get('/alunos')
    //         .expect(200)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             done();
    //         });

    //     });

    it('deve validar o contrato HTTP e deve verificar se a criação de um aluno está funcionando ', async () => {
        const resposta = await request(app).post('/alunos')
            .send({ nome: 'João', matricula: '202610020005' });
        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('id');

        const alunoNoBanco = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM alunos WHERE matricula = ?';
            db.get(query, ['202610020005'], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            })
        })
        expect(alunoNoBanco).toBeDefined();
        expect(alunoNoBanco.nome).toBe('João');
        expect(alunoNoBanco.matricula).toBe('202610020005');

        // expect(resposta.body).toHaveProperty('nome', 'João');
        // expect(resposta.body).toHaveProperty('matricula', '202610020005');

        /* await request(app).post('/alunos')
        .send({ nome: 'João', matricula: '202610020005' })
        .expect(201)
        .end((err, res) => {
            if (err) return done(err);
            done();
        });
        */
    });
    /* it('deve validar o contrato HTTP', (done) => {
        request(app).post('/alunos')
            .send({ nome: 'Maria', matricula: '202610020006' })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });*/
    it('deve retornar um erro 400 se os dados estiverem incompletos', async () => {
        const resposta = await request(app).post('/alunos')
            .send({ nome: 'Sem matricula' })

        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty('erro', 'Dados incompletos');

    });


    it('Validação de Efeito Colateral, verificar duplicidade', async () => {

        await request(app).post('/alunos')
            .send({ nome: 'Carlos', matricula: '202610020007' })
            .expect(201);
        await request(app).post('/alunos')
            .send({ nome: 'Carlos', matricula: '202610020007' })
            .expect(409)
        /*.end((err, res) => {
            if (err) return done(err);
            done();
        }); */

        db.get
    });
})
