import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { Component, Inject, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Users } from "app/extras/users";
import * as util from "./../../extras/utils";

@Component({
  selector: "app-users-modal",
  templateUrl: "./users-modal.component.html",
  styleUrls: ["./users-modal.component.css"],
})
export class UsersModalComponent implements OnInit {
  userFormGroup: FormGroup;
  updation: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UsersModalComponent>,
    private fb: FormBuilder,
    private dbRef: AngularFirestore,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initialiseValues();
  }

  initialiseValues() {
    if (this.data["user"] == undefined) {
      this.userFormGroup = this.fb.group({
        userId: [this.dbRef.createId()],
        name: ["", Validators.required],
        email: ["", Validators.required],
        phone: ["", Validators.required],
        address: [""],
        status: [true],
        comments: [""],
        profileImage: [""],
        creationDate: [new Date()],
        frequency: [0],
      });
    } else {
      let user: Users = this.data.user;
      this.userFormGroup = this.fb.group({
        userId: [user.userId],
        name: [user.name, Validators.required],
        email: [user.email, Validators.required],
        phone: [user.phone, Validators.required],
        address: [user.address],
        status: [user.status],
        comments: [user.comments],
        profileImage: [user.profileImage],
        creationDate: [user.creationDate],
        frequency: [user.frequency],
      });
    }
  }

  saveUserInDb(form: { value: any }) {
    let userObj: Users = Object.assign({}, form.value);
    this.dbRef
      .collection(util.USER_COLLECTION)
      .doc(userObj.userId)
      .set(userObj, { merge: true })
      .then(() => {
        this.dialogRef.close();
        this.snackbar.open("User Saved Successfully", "", {
          duration: 2500,
          panelClass: ["alert", "alert-success"],
        });
      })
      .catch((error) => {
        console.error(error);
        this.snackbar.open("Something went wrong!! Please try again", "", {
          duration: 2500,
          panelClass: ["alert", "alert-danger"],
        });
      });
  }
}
