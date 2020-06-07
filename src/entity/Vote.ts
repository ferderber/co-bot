import { Column, Entity, ManyToOne } from "typeorm";
import {Sound} from "./Sound";
import {User} from './User';

@Entity()
// @Index(["user", "sound"], { unique: true })
export class Vote {

    @ManyToOne(() => User, (u) => u.votes, {primary: true})
    public user: User;

    @ManyToOne(() => Sound, {primary: true})
    public sound: Sound;

    @Column()
    public rating: number;

    constructor(v: Partial<Vote>) {
        Object.assign(this, v);
    }

    public toString(): string {
        return `${this.user.username} Rated ${this.sound.key} ${ this.rating > 0 ? '+' : '-'}${this.rating}`;
    }
}
