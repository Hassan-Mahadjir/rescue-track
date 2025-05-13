import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ItemService } from './item.service';
import {
  CreateEquipmentDto,
  CreateItemDto,
  CreateMedicationDto,
} from './dto/create-item.dto';
import { UpdateMedicationDto, UpdateEquipmentDto } from './dto/update-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('/medication')
  createMedication(@Body() createItemDto: CreateMedicationDto, @Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.itemService.create(userId, createItemDto, 'medication');
  }

  @Post('/equipment')
  createEquipment(@Body() createItemDto: CreateEquipmentDto, @Req() req) {
    const userId = Number(req.user.id);
    if (isNaN(userId)) throw new BadRequestException('Invalid user id');

    return this.itemService.create(userId, createItemDto, 'equipment');
  }

  @Get()
  findAll() {
    return this.itemService.findAll();
  }

  @Get('/medication/:id')
  findMedication(@Param('id') id: string) {
    return this.itemService.findOne(+id, 'medication');
  }

  @Get('/equipment/:id')
  findEquipment(@Param('id') id: string) {
    return this.itemService.findOne(+id, 'equipment');
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateMedicationDto | UpdateEquipmentDto,
  ) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
