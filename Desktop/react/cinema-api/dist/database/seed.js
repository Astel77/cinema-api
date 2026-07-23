"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const user_entity_1 = require("../users/user.entity");
const movie_entity_1 = require("../movies/movie.entity");
const cinema_entity_1 = require("../cinemas/cinema.entity");
const session_entity_1 = require("../sessions/session.entity");
const reservation_entity_1 = require("../reservations/reservation.entity");
const role_enum_1 = require("../common/enums/role.enum");
dotenv.config();
async function seed() {
    const dbType = process.env.DB_TYPE || 'sqlite';
    const dataSource = new typeorm_1.DataSource(dbType === 'postgres'
        ? {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [user_entity_1.User, movie_entity_1.Movie, cinema_entity_1.Cinema, session_entity_1.Session, reservation_entity_1.Reservation],
            synchronize: true,
        }
        : {
            type: 'sqlite',
            database: process.env.DB_SQLITE_PATH || 'cinema.sqlite',
            entities: [user_entity_1.User, movie_entity_1.Movie, cinema_entity_1.Cinema, session_entity_1.Session, reservation_entity_1.Reservation],
            synchronize: true,
        });
    await dataSource.initialize();
    console.log('📦 Connexion à la base de données établie');
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const movieRepo = dataSource.getRepository(movie_entity_1.Movie);
    const cinemaRepo = dataSource.getRepository(cinema_entity_1.Cinema);
    const sessionRepo = dataSource.getRepository(session_entity_1.Session);
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@pathe-cinema.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
    let admin = await userRepo.findOne({ where: { email: adminEmail } });
    if (!admin) {
        admin = userRepo.create({
            fullName: 'Administrateur Pathé',
            email: adminEmail,
            password: await bcrypt.hash(adminPassword, 10),
            role: role_enum_1.Role.ADMIN,
        });
        await userRepo.save(admin);
        console.log(`✅ Compte admin créé : ${adminEmail} / ${adminPassword}`);
    }
    else {
        console.log('ℹ️  Le compte admin existe déjà');
    }
    const cinemasData = [
        { name: 'CINÉMA Pathé', address: 'Dakar', rooms: 8 },
        { name: 'CINÉMA Pathé', address: 'Parcelles', rooms: 5 },
        { name: 'CINÉMA Pathé', address: 'Thiès', rooms: 4 },
    ];
    const cinemas = [];
    for (const c of cinemasData) {
        let cinema = await cinemaRepo.findOne({ where: { name: c.name, address: c.address } });
        if (!cinema) {
            cinema = cinemaRepo.create(c);
            cinema = await cinemaRepo.save(cinema);
        }
        cinemas.push(cinema);
    }
    console.log(`✅ ${cinemas.length} cinémas prêts`);
    const moviesData = [
        {
            title: 'Avengers Endgame',
            genre: 'Action',
            image: 'https://picsum.photos/300/450?1',
            isNew: true,
            durationMinutes: 181,
            description: "L'affrontement final contre Thanos.",
            sessions: [
                { day: 'Vendredi', time: '18:00', room: 'Salle 1', price: 5000 },
                { day: 'Samedi', time: '21:00', room: 'Salle 2', price: 6000 },
            ],
        },
        {
            title: 'The Dark Knight',
            genre: 'Action',
            image: 'https://picsum.photos/300/450?2',
            isNew: true,
            durationMinutes: 152,
            description: 'Batman affronte le Joker à Gotham.',
            sessions: [{ day: 'Jeudi', time: '20:00', room: 'Salle 3', price: 5000 }],
        },
        {
            title: 'Joker',
            genre: 'Drame',
            image: 'https://picsum.photos/300/450?3',
            isNew: true,
            durationMinutes: 122,
            description: "L'origine du célèbre clown criminel.",
            sessions: [{ day: 'Dimanche', time: '19:00', room: 'Salle 4', price: 5500 }],
        },
        {
            title: 'Titanic',
            genre: 'Romance',
            image: 'https://picsum.photos/300/450?4',
            isNew: false,
            durationMinutes: 195,
            description: 'Une histoire d\u2019amour sur le paquebot mythique.',
            sessions: [],
        },
        {
            title: 'Interstellar',
            genre: 'Science Fiction',
            image: 'https://picsum.photos/300/450?5',
            isNew: false,
            durationMinutes: 169,
            description: 'Un voyage à travers les étoiles pour sauver l\u2019humanité.',
            sessions: [],
        },
    ];
    for (const m of moviesData) {
        let movie = await movieRepo.findOne({ where: { title: m.title } });
        if (!movie) {
            const { sessions, ...movieFields } = m;
            movie = movieRepo.create(movieFields);
            movie = await movieRepo.save(movie);
            for (const [i, s] of sessions.entries()) {
                const session = sessionRepo.create({
                    ...s,
                    movieId: movie.id,
                    cinemaId: cinemas[i % cinemas.length].id,
                    totalSeats: 50,
                });
                await sessionRepo.save(session);
            }
        }
    }
    console.log(`✅ ${moviesData.length} films prêts`);
    console.log('🌱 Seed terminé avec succès.');
    await dataSource.destroy();
}
seed().catch((err) => {
    console.error('❌ Erreur lors du seed :', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map