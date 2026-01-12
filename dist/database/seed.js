"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/entities/user.entity");
const enums_1 = require("../common/enums");
require("dotenv/config");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'farmer_certification',
    entities: [user_entity_1.User],
    synchronize: true,
});
async function seed() {
    console.log('Starting database seeding...');
    try {
        await AppDataSource.initialize();
        console.log('Database connection established');
        const userRepository = AppDataSource.getRepository(user_entity_1.User);
        const existingAdmin = await userRepository.findOne({
            where: { email: 'admin@farmcert.com' },
        });
        if (existingAdmin) {
            console.log('Admin user already exists, skipping...');
        }
        else {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            const admin = new user_entity_1.User();
            admin.email = 'admin@farmcert.com';
            admin.password = hashedPassword;
            admin.name = 'System Administrator';
            admin.role = enums_1.UserRole.ADMIN;
            admin.status = enums_1.CertificationStatus.CERTIFIED;
            await userRepository.save(admin);
            console.log('Admin user created successfully');
            console.log('Email: admin@farmcert.com');
            console.log('Password: Admin@123');
        }
        console.log('Database seeding completed!');
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
    finally {
        await AppDataSource.destroy();
    }
}
seed();
//# sourceMappingURL=seed.js.map