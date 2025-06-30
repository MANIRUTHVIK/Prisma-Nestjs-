import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './user/user.service';
import { PostsService } from './post/post.service';
import { User as UserModel, Post as PostModel } from 'generated/prisma';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly postService: PostsService,
  ) {}

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userService.user({ id: Number(id) });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    const post = await this.postService.post({ id: Number(id) });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      // skip: 1,
      // take: 2,
      // where: {
      //   content: {
      //     contains: 'two',
      //   },
      // },
      skip: 0,
    });
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content?: string; authorEmail: string },
  ): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.createPost({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.updatePost({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost({ id: Number(id) });
  }
}
