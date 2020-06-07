import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import {User} from './User';

@Entity()
export class Sound {

    @PrimaryColumn()
    public id: string;

    @PrimaryColumn()
    public key: string;

    @Column()
    public filename: string;

    @Column()
    public fileType: string;

    @Column('float', { default: 0 })
    public duration: number;

    @Column({default: 0})
    public playCount: number;

    @Column({default: 0})
    public points: number;

    @Column({default: new Date()})
    public dateUploaded: Date;

    @ManyToOne(() => User, (u) => u.sounds)
    public user: User;

    constructor(s: Partial<Sound>) {
        Object.assign(this, s);
    }

    public toString(): string {
        return `${this.key}:
          Uploaded by: ${this.user.username}
          Duration: ${this.duration}
          Filename: ${this.filename}
          Play Count: ${this.playCount}
          Date Uploaded: ${this.dateUploaded}`;
    }
}
