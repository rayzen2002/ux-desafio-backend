import { BadRequestException, Injectable, type ArgumentMetadata, type PipeTransform } from "@nestjs/common";
import type { ZodTypeAny } from "zod";


@Injectable()
export class ZodValidationPipe implements PipeTransform {

  constructor(private schema: ZodTypeAny){}
  transform(value: any, metadata: ArgumentMetadata){
    const result = this.schema.safeParse(value)
    if (!result.success){
      throw new BadRequestException(
        result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      )
    }
    return result.data
  }
}