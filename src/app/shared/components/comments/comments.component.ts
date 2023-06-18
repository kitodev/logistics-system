import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommentApis, CommentService } from './comment.service';
import moment from 'moment/moment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  comment: string;
  private unsubscribe = new Subject<void>();
  errors: HttpErrorResponse;
  commentList: CommentDto[];

  @Input() chosenApi: CommentApis;
  @Input() chosenId: string;
  @Input() refresh?: Observable<void>;

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();

    if (this.refresh) {
      this.refresh
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.loadComments();
      });
    }
  }

  private loadComments(): void {
    this.commentService
      .getComments(this.chosenApi, this.chosenId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.commentList = response.sort((a, b) => {
            return moment(a.created).isBefore(moment(b.created)) ? 1 : -1;
          });
        }
      );
  }

  saveComment(): void {
    this.commentService
      .createComment(this.chosenApi, this.chosenId, this.comment)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.comment = null;
          this.loadComments();
        },
        (error: HttpErrorResponse) => {
          this.errors = error;
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
