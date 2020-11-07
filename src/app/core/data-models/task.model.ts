import { EMPTY_STRING } from "../constants/constants";

export class Task {
    id?: string = EMPTY_STRING;
    message: string = EMPTY_STRING;
    priority: string = EMPTY_STRING;
    assigned_to: string;
    due_date: any = null;
}
