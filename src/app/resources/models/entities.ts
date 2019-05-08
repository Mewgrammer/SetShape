import {EWorkoutType, ITrainingDay, ITrainingPlan, IWorkout, IWorkoutHistoryItem} from './interfaces';
import {Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';


@Entity('workout')
export class Workout implements IWorkout{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column()
    public repetitions: number;

    @Column()
    public sets: number;

    @Column("int")
    public type: EWorkoutType;

    @Column()
    public weight: number;

    public static create(w: IWorkout): Workout {
        const workout = new Workout();
        workout.type = w.type;
        workout.name = w.name;
        workout.sets = w.sets;
        workout.repetitions = w.repetitions;
        workout.weight = w.weight;
        return workout;
    }

}

@Entity('trainingPlan')
export class TrainingPlan implements ITrainingPlan{

    @PrimaryGeneratedColumn()
    public id: number;

    @OneToMany(type => TrainingDay, trainingDay => trainingDay.id)
    public days: ITrainingDay[];

    @Column()
    public name: string;

}

@Entity('trainingDay')
export class TrainingDay implements ITrainingDay{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany(type => Workout, workout => workout.id)
    public workouts: IWorkout[];

}

@Entity('historyItem')
export class WorkoutHistoryItem implements IWorkoutHistoryItem{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column("string")
    public date: Date;

    @OneToOne(type => Workout, workout => workout.id)
    public workout: IWorkout;


}
