import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BlogComment } from '../../../models/blog-comment.model';
import { SpringBlogService } from '../../../services/spring-blog.service';
import { BlogArticleComponent } from '../blog-article/blog-article.component';

@Component({
  selector: 'app-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.css'],
})
export class BlogCommentComponent implements OnInit {
  commentForm: FormGroup;
  @Input() commentId = null;
  @Input() parentId = null;
  @Input() mainParentId = null;

  @Output() commentSubmitted: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private springBlogService: SpringBlogService
  ) {}

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      content: new FormControl(null, [Validators.required]),
      author: new FormControl(null, [Validators.required,  this.noWhitespaceValidator]),
      postId: new FormControl(null, [Validators.required]),
      commentId: new FormControl(null),
      mainCommentId: new FormControl(null),
    });
  }

  onSubmit() {
    const id: number = +this.route.snapshot.params['id'];
    this.commentForm.get('postId').setValue(id);

    if (this.commentForm.get('author').value == "XXX. XXXXXXX XXXXX" && !BlogArticleComponent.adminUserr ) {
      return;
    }

    if (this.commentForm.valid) {
      this.commentForm.get('commentId').setValue(this.commentId);
      this.commentForm.get('mainCommentId').setValue(this.mainParentId);
      let blogComment = new BlogComment();
      blogComment = this.commentForm.value;
      this.springBlogService.postComment(blogComment).subscribe(() => {
        this.commentSubmitted.emit(true);
      });
      this.commentForm.reset();
    } else {
      this.commentForm.markAllAsTouched();
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
