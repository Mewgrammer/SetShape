
export enum EWorkoutType {
    BankDruecken = 1,
    Butterfly =  2,
    Dips = 3,
    TrizepsCurls = 4,
}

export interface IWorkout {
    id: number;
    type: EWorkoutType;
    name: string;
    repetitions: number;
    sets: number;
    weight?: number;
}


export interface IWorkoutHistoryItem {
    workout: IWorkout,
    date: Date
}



export class Workout implements IWorkout {
    public id: number = 0;
    constructor(public type: EWorkoutType,
                public name: string,
                public sets: number,
                public repetitions: number,
                public weight?: number) {

    }

    public static create(workout: IWorkout): Workout {
        return new Workout(
            workout.type,
            workout.name,
            workout.sets,
            workout.repetitions,
            workout.weight
        );
    }
}
