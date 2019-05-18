import {EWorkoutType, ITrainingDay, ITrainingPlan, IWorkout, IWorkoutHistoryItem} from './interfaces';
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';


@Entity('workout')
export class Workout implements IWorkout {
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

    @ManyToOne(type => TrainingDay, day => day.workouts)
    public trainingDay?: TrainingDay;

    @OneToMany(type => WorkoutHistoryItem, item => item.workout, {cascade: true})
    public workoutHistoryItem?: WorkoutHistoryItem;

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

    @OneToMany(type => TrainingDay, trainingDay => trainingDay.trainingPlan, { cascade: true, eager: true })
    public days: TrainingDay[];

    @Column()
    public name: string;

    @Column()
    public active: boolean = false;


}

@Entity('trainingDay')
export class TrainingDay implements ITrainingDay {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany(type => Workout, workout => workout.trainingDay, { cascade: true, eager: true })
    public workouts: Workout[];

    @ManyToOne(type => TrainingPlan, plan => plan.days )
    public trainingPlan?: TrainingPlan;

}

@Entity('history')
export class WorkoutHistoryItem implements IWorkoutHistoryItem{

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public timestamp: string;

    @ManyToOne(type => Workout, workout => workout.workoutHistoryItem, { eager: true })
    public workout: Workout;

    public get Date() {
        return new Date(Date.parse(this.timestamp));
    }

    public set Date(date: Date) {
        this.timestamp = date.toDateString();
    }


}
