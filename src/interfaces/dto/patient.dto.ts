import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'person_id field is required' })
  @IsUUID('7', { message: 'person_id must be a valid UUID v7' })
  person_id: string;
}
