import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { Connection, createConnection, getManager } from 'typeorm';
import Config from './Config';
import { Image } from "./entity/Image";
import { Sound } from "./entity/Sound";
import { User } from "./entity/User";
import { Vote } from "./entity/Vote";

(mongoose.Promise as any) = global.Promise;

interface IImageSchema {
    key: string;
    filename: string;
    user: string;
    playCount: number;
    date: Date;
}

interface ISoundSchema {
    key: string;
    filename: string;
    user: string;
    playCount: number;
    date: Date;
    points: number;
    duration: number;
}

interface IVoteSchema {
    user: string;
    sound: string;
    rating: number;
}

interface IUserSchema {
    _id: any;
    username: string;
    avatar: string;
    joinDate: Date;
    level: number;
    xp: number;
    soundPlays: number;
}

const imageSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date,
    },
    filename: {
        required: true,
        type: String,
    },
    key: {
        required: true,
        type: String,
        unique: true,
    },
    playCount: {
        default: 0,
        type: Number,
    },
    user: {
        ref: 'User',
        type: String,
    },
});
const soundSchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date,
    },
    duration: {
        default: 0,
        type: Number,
    },
    filename: {
        required: true,
        type: String,
    },
    key: {
        required: true,
        type: String,
        unique: true,
    },
    playCount: {
        default: 0,
        type: Number,
    },
    points: {
        default: 0,
        type: Number,
    },
    user: {
        ref: 'User',
        type: String,
    },
});

const userSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String,
    },
    avatar: {
        type: String,
    },
    joinDate: {
        default: new Date(),
        type: Date,
    },
    level: {
        default: 1,
        type: Number,
    },
    soundPlays: {
        default: 0,
        type: Number,
    },
    username: {
        type: String,
    },
    xp: {
        default: 0,
        type: Number,
    },
});

const voteSchema = new mongoose.Schema({
    rating: Number,
    sound: {
        ref: 'Sound',
        type: Number,
    },
    user: {
        ref: 'User',
        type: Number,
    },
});
interface IUserModel extends IUserSchema, mongoose.Document {}
interface ISoundModel extends ISoundSchema, mongoose.Document {}
interface IImageModel extends IImageSchema, mongoose.Document {}
interface IVoteModel extends IVoteSchema, mongoose.Document {}
const UserModel = mongoose.model<IUserModel>('users', userSchema);
const ImageModel = mongoose.model<IImageModel>('images', imageSchema);
const SoundModel = mongoose.model<ISoundModel>('sounds', soundSchema);
const VoteModel = mongoose.model<IVoteModel>('votes', voteSchema);

function soundModelToEntity(sound: ISoundSchema): Sound {
    return new Sound({
        dateUploaded: sound.date,
        duration: sound.duration,
        fileType: sound.filename.substring(sound.filename.lastIndexOf('.')),
        filename: sound.filename,
        id: sound.filename.substring(0, sound.filename.lastIndexOf('.')),
        key: sound.key,
        playCount: sound.playCount,
        points: sound.points,
        user: new User({id: sound.user}),
    });
}

function imageModelToEntity(image: IImageSchema): Image {
    return new Image({
        dateUploaded: image.date,
        displayCount: image.playCount,
        fileType: image.filename.substring(image.filename.lastIndexOf('.')),
        filename: image.filename,
        id: image.filename.substring(0, image.filename.lastIndexOf('.')),
        key: image.key,
        user: new User({id: image.user}),
    });
}

function userModelToEntity(user: IUserSchema): User {
    return new User({
        avatar: user.avatar,
        id: user._id,
        joinDate: user.joinDate,
        level: user.level,
        soundPlays: user.soundPlays,
        username: user.username,
        xp: user.xp,
    });
}

function voteModelToEntity(vote: IVoteSchema): Vote {
    return new Vote({
        rating: vote.rating,
        sound: new Sound({id: vote.sound}),
        user: new User({id: vote.user}),
    });
}

async function getUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(userModelToEntity);
}

async function getSounds(): Promise<Sound[]> {
    const sounds = await SoundModel.find({});
    return sounds.map(soundModelToEntity);
}

async function getImages(): Promise<Image[]> {
    const images = await ImageModel.find({});
    return images.map(imageModelToEntity);
}

async function getVotes(): Promise<Vote[]> {
    const votes = await VoteModel.find({});
    return votes.map(voteModelToEntity);
}

async function convertDatabase(con: Connection) {
    try {
        mongoose.connect(Config.db, { useMongoClient: true });
        const users = await getUsers();
        console.log(users);
        const sounds = await getSounds();
        const images = await getImages();
        const votes = await getVotes();

        const manager = con.createEntityManager();
        await manager.save(User, users);
        await manager.save(Sound, sounds);
        await manager.save(Vote, votes);
        await manager.save(Image, images);
    } catch (e) {
        console.error(e);
    }
}

createConnection().then(async (con) => {
    console.log('DB Connection established');
    await convertDatabase(con);
    const manager = con.createEntityManager();
}).catch((error) => console.log(error));
