import * as mongoose from 'mongoose';
import 'reflect-metadata';
import { getManager, createConnection, Connection } from 'typeorm';
import { User } from "./entity/User";
import { Sound } from "./entity/Sound";
import { Image } from "./entity/Image";
import { Vote } from "./entity/Vote";
import Config from './Config';

(<any>mongoose.Promise) = global.Promise;

interface IImageSchema {
    key: string,
    filename: string,
    user: string,
    playCount: number,
    date: Date
}

interface ISoundSchema {
    key: string,
    filename: string,
    user: string,
    playCount: number,
    date: Date,
    points: number,
    duration: number
}

interface IVoteSchema {
    user: string,
    sound: string,
    rating: number
}

interface IUserSchema {
    _id: any,
    username: string,
    avatar: string,
    joinDate: Date,
    level: number,
    xp: number,
    soundPlays: number,
}

const imageSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
    },
    playCount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    }
});
const soundSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    filename: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
    },
    playCount: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    },
    points: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    }
});

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date,
        default: new Date()
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    soundPlays: {
        type: Number,
        default: 0
    }
});

const voteSchema = new mongoose.Schema({
    user: {
        type: Number,
        ref: 'User'
    },
    sound: {
        type: Number,
        ref: 'Sound'
    },
    rating: Number
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
        id: sound.filename.substring(0, sound.filename.lastIndexOf('.')),
        key: sound.key,
        filename: sound.filename,
        playCount: sound.playCount,
        points: sound.points,
        dateUploaded: sound.date,
        duration: sound.duration,
        user: new User({id: sound.user}),
        fileType: sound.filename.substring(sound.filename.lastIndexOf('.'))
    });
}

function imageModelToEntity(image: IImageSchema): Image {
    return new Image({
        id: image.filename.substring(0, image.filename.lastIndexOf('.')),
        key: image.key,
        filename: image.filename,
        displayCount: image.playCount,
        dateUploaded: image.date,
        user: new User({id: image.user}),
        fileType: image.filename.substring(image.filename.lastIndexOf('.'))
    })
}

function userModelToEntity(user: IUserSchema): User {
    return new User({
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        joinDate: user.joinDate,
        xp: user.xp,
        level: user.level,
        soundPlays: user.soundPlays
    })
}

function voteModelToEntity(vote: IVoteSchema): Vote {
    return new Vote({
        rating: vote.rating,
        sound: new Sound({id: vote.sound}),
        user: new User({id: vote.user})
    })
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
    } catch(e) {
        console.error(e);
    }
}

createConnection().then(async (con) => {
    console.log('DB Connection established');
    await convertDatabase(con);
    const manager = con.createEntityManager();
}).catch((error) => console.log(error));

