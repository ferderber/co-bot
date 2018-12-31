import { Column, Entity, Index, ManyToOne, PrimaryColumn, Generated } from "typeorm";
import {User} from './User';

@Entity()
export class Image {

    @PrimaryColumn()
    public id: string

    @PrimaryColumn()
    public key: string;

    @Column()
    public filename: string;

    @Column()
    public fileType: string;

    @Column({default: 0})
    public displayCount: number;

    @Column()
    public dateUploaded: Date;

    @ManyToOne(() => User, (u) => u.images)
    public user: User;

    constructor(i: Partial<Image>) {
        Object.assign(this, i);
    }

    public toString(): string {
        return `${this.key}:
          Uploaded by: ${this.user.username}
          Display Count: ${this.displayCount}
          Filename: ${this.filename}
          Date Uploaded: ${this.dateUploaded}`
    }
}
