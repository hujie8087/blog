import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from '@libs/db/models/message.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('messages')
@ApiTags('留言')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: Message, @Req() req: any) {
    return this.messagesService.create(createMessageDto);
  }

  @Get('childComment/:id')
  findChildCommentById(@Param('id') id: string, @Query() query: any) {
    return this.messagesService.getAllComment(id, query);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.messagesService.findAll(query);
  }
}
