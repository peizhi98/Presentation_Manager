package com.fyp.presentationmanager.model;

import com.fyp.presentationmanager.enums.ResponseStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResponseModel<T> {
    private T data;

    private ResponseStatus status;

    private String message;

    public void success(T data) {
        this.data = data;
        this.status = ResponseStatus.SUCCESS;
    }

    public void success(T data, String message) {
        this.data = data;
        this.status = ResponseStatus.SUCCESS;
        this.message = message;
    }

    public void failed() {
        this.status = ResponseStatus.FAILED;
    }

    public void failed(T data) {
        this.data = data;
        this.status = ResponseStatus.FAILED;
    }

    public void failed(T data, String message) {
        this.data = data;
        this.status = ResponseStatus.FAILED;
        this.message = message;
    }

}
