import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvoicePdfMetadata {
  @Field(() => Int)
  id: number;
  @Field({ nullable: true })
  downloadUrl?: string;
}
