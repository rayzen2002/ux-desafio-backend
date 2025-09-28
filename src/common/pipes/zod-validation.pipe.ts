import { BadRequestException, Injectable, type ArgumentMetadata, type PipeTransform } from "@nestjs/common";
import type { ZodTypeAny } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodTypeAny) {}
  
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }    
    let data = value;
    if (typeof value === 'string') {
      try {
        data = JSON.parse(value);
      } catch {
        throw new BadRequestException('Invalid JSON');
      }
    }
    
    const result = this.schema.safeParse(data);
    if (!result.success) {
      throw new BadRequestException(
        result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      );
    }
    return result.data;
  }
}