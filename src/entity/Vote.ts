import { Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";
import {User} from './User';
import {Sound} from "./Sound";

@Entity()
@Index(["user", "sound"], { unique: true })
export class Vote {

    @ManyToOne(() => User, (u) => u.votes)
    public user: User;

    @ManyToOne(() => Sound)
    public sound: Sound;

    @Column()
    public rating: number

    constructor(v: Partial<Vote>) {
        Object.assign(this, v);
    }

    public toString(): string {
        return `${this.user.username} Rated ${this.sound.key} ${ this.rating > 0 ? '+' : '-'}${this.rating}`
    }
}
