import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DeleteModalComponent } from "app/entryComponents/delete-modal/delete-modal.component";
import { UsersModalComponent } from "app/entryComponents/users-modal/users-modal.component";
import { Users } from "app/extras/users";
import * as util from "./../extras/utils";

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent implements OnInit {
  usersList: Users[] = [];

  constructor(
    private dialog: MatDialog,
    private dbRef: AngularFirestore,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.dbRef
      .collection(util.USER_COLLECTION)
      .snapshotChanges()
      .subscribe((response) => {
        this.usersList = response.map((e) => e.payload.doc.data() as Users);
      });
  }

  openUserModal() {
    this.dialog.open(UsersModalComponent, {
      data: {},
    });
  }

  updateUser(user: Users) {
    this.dialog.open(UsersModalComponent, {
      data: {
        user: user,
      },
    });
  }

  deleteUser(userId: string) {
    this.dialog
      .open(DeleteModalComponent)
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        if (res == 1 && res != undefined) {
          this.dbRef
            .collection(util.USER_COLLECTION)
            .doc(userId)
            .delete()
            .then(() => {
              this.snackbar.open("User Deleted Successfully", "", {
                duration: 2500,
                panelClass: ["alert", "alert-success"],
              });
            })
            .catch((error) => {
              console.error(error);
              this.snackbar.open(
                "Something went wrong!! Please try again",
                "",
                {
                  duration: 2500,
                  panelClass: ["alert", "alert-danger"],
                }
              );
            });
        }
      });
  }
}
