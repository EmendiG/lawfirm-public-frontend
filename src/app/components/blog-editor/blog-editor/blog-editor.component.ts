import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlogCategoryEnum } from '../../../models/blog-category.enum';
import { BlogPost } from '../../../models/blog-post.model';
import { filePromise } from '../../../models/file-upload.model';
import { FileUploadService } from '../../../services/fire-upload.service';
import { SpringEditorService } from '../../../services/spring-editor.service';

import { MyUploadAdapter } from '../firebase-proxy/upload.adapter';


@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.css'],
})
export class BlogEditorComponent implements OnInit {

  @ViewChild( 'postForm',  { static: false }) postForm: NgForm;
  @ViewChild( 'editorCK' ) editorComponent: CKEditorComponent;
  editor = ClassicEditor;
  ckeConfig: any;
  entryData: any = `<h1>Jesteś super!</h1><br>`;
  textarea: any;

  isLoading: boolean = false;

  remainingChars = 250;

  blogPostForm: FormGroup;
  formInvalid: boolean = false;
  pictureView: string;
  pictureSize: string;
  blogId : boolean = false;

  BlogCategoryEnum : BlogCategoryEnum;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private fileUploadService: FileUploadService,
              private springEditorService: SpringEditorService,
              private route: ActivatedRoute) { }

  public getEditor() {
    if(isPlatformBrowser(this.platformId)) {
      return this.editorComponent.editorInstance;
    }
  }

  ngOnInit(): void {

    this.blogPostForm = new FormGroup({
      'id' : new FormControl(null),
      'postTime' : new FormControl(null),
      'title' : new FormControl(null, [Validators.required]),
      'category' : new FormControl(null, [Validators.required]),
      'pictureUrl' : new FormControl(null, [Validators.required]),
      'pictureSize' : new FormControl('cover', [Validators.required]),
      'pictureDescription' : new FormControl(null),
      'description' : new FormControl(null, [Validators.required]),
      'content' : new FormControl(this.entryData, [Validators.required]),
      'tags' : new FormControl(null, [Validators.required]),
      'author' : new FormControl("XXXXXXX XXXXXX", [Validators.required]),
    });

    this.route.data.subscribe((res : BlogPost) => {
      this.pictureView = res[0].pictureUrl;
      let blogPost = new BlogPost();
      blogPost = res[0]
      if (blogPost.id) {
        this.blogId = true;
      }
      delete blogPost._links
      this.blogPostForm.setValue(blogPost);
    })

    this.setEditorConfig();

  }

  changePictureSize($event) {
    this.pictureSize = $event
  }

  fileUpload(event) {
    this.isLoading = true;
    new Promise<filePromise>((resolve, reject) => {
      this.fileUploadService.getPromise(resolve, reject, event.target.files[0]);
    }).then(value=> {
      this.pictureView = value.default;
      this.isLoading = false;
    });
  }

  onSubmit() {
    // add final picture url
    this.blogPostForm.get("pictureUrl").setValue(this.pictureView);
    if (this.blogPostForm.valid) {
      this.formInvalid = false;
      let blogPost = new BlogPost();
      blogPost = this.blogPostForm.value;
      delete blogPost.id
      delete blogPost.postTime

      this.springEditorService.postPost(blogPost).subscribe( () => {
        alert("XXXX XXXX XXXXX :)")
      });
    } else {
      this.blogPostForm.markAllAsTouched();
      this.formInvalid = true;
    }
  }

  onUpdate() {
    this.blogPostForm.get("pictureUrl").setValue(this.pictureView);
    if (this.blogPostForm.valid) {
      this.formInvalid = false;
      let blogPost = new BlogPost();
      blogPost = this.blogPostForm.value;
      this.springEditorService.updatePost(blogPost).subscribe( () => {
        alert("XXXX XXXX XXXXX :)")
      });
    } else {
      this.blogPostForm.markAllAsTouched();
      this.formInvalid = true;
    }
  }

  onCheck() {
    if (this.blogPostForm.valid) {
      this.formInvalid = false;
    } else {
      this.blogPostForm.markAsTouched();
      this.formInvalid = true;
    }
    let blogPost = new BlogPost();
    blogPost = this.blogPostForm.value;
    localStorage.setItem('blogPost', JSON.stringify(blogPost))

    this.textarea = this.getEditor().getData();
  }

  onReset() {
    if (confirm("XXXX XXXX XXXXX ?") ) {
      this.blogPostForm.reset();
      this.blogId = false;
      this.pictureView = '';
      localStorage.removeItem('blogPost')
    }
  }

  onDelete() {
    if (confirm("XXXX XXXX XXXXX ?") ) {
      this.springEditorService.deletePost(this.blogPostForm.value.id).subscribe( () => {
        delete this.blogPostForm.value.id
        delete this.blogPostForm.value.postTime
        this.blogId = false;
        alert("XXXX XXXX XXXXX !")
      });
    }
  }


  onReady(eventData) {
    eventData.plugins.get('FileRepository').createUploadAdapter = function (
      loader
    ) {
      return new MyUploadAdapter(loader);
    };
  }




  setEditorConfig() {
    this.ckeConfig = {
      language: 'pl',
      fontFamily: {
        options: [
            'default',
            'Poppins',
            'Poppins-Light',
            'Poppins-Bold',
            'Bodoni Moda',
            'Times New Roman',
            'Arial',
            'Verdana',
            'Georgia',
            'Garamond'
        ]
      },

      fontSize: {
        options: [
            10,
            11,
            12,
            '14 default',
            16,
            18,
            20,
            22,
            24,
            26,
            30,
            36
        ]
      },
      toolbar: {
        items: [
          'heading',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bold',
          'italic',
          'underline',
          'subscript',
          'superscript',
          'strikethrough',
          'horizontalLine',
          '|',
          'bulletedList',
          'numberedList',
          'alignment',
          'undo',
          'redo',
          '|',
          'blockQuote',
          'imageUpload',
          'todolist',
          'insertTable',
          'mediaEmbed',
          'link',
          'indent',
          'outdent',
        ]
      },
      image: {
        resizeUnit: 'px',
        toolbar: [
          'imageStyle:alignLeft',
          'imageStyle:alignCenter',
          'imageStyle:alignRight',
          '|',
          'imageStyle:full',
          'imageStyle:side',
          '|',
          'imageTextAlternative',
          ],
          styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight']
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6',
          },
        ]
      }
    };
  }
}
