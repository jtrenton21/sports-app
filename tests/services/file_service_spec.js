/* global describe, beforeEach, it, module, inject, navigator */
describe("File services", function () {
  "use strict";
  var scope, service, openSuccess, openError;

  beforeEach(module("dynamic-sports.services"));

  beforeEach(inject(function ($rootScope, _fileService_) {
    scope = $rootScope.$new();
    service = _fileService_;
    openSuccess = jasmine.createSpy();
    openError = jasmine.createSpy();
  }));

  describe("list(successCb, errorCb)", function () {

    it("should use the file service", function () {
      spyOn(window, "requestFileSystem");
      service.list(openSuccess, openError);
      expect(window.requestFileSystem).toHaveBeenCalled();
    });

    it("should return a list of files on success", function () {
      service.list(openSuccess, openError);
      var result = [{name: "fghijkl"}, {name: "mnopqrst"}];
      window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnReadEntriesSuccess(result);
      expect(openSuccess).toHaveBeenCalledWith(result);
    });

    it("should call the errorCb if requestFileSystem fails", function () {
      service.list(openSuccess, openError);
      window.OnRequestFileSystemError();
      expect(openError).toHaveBeenCalled();
    });

    it("should call the errorCb if reading files fails", function () {
      service.list(openSuccess, openError);
      window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnReadEntriesError();
      expect(openError).toHaveBeenCalled();
    });
  });

  describe("open(fileName, successCb, errorCb)", function () {

    it("should use the file service", function () {
      spyOn(window, "requestFileSystem");
      service.open("file", openSuccess, openError);
      expect(window.requestFileSystem).toHaveBeenCalled();
    });

    it("should return the file content on success", function () {
      service.open("file", openSuccess, openError);
      window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnGetFileSuccess().OnFileEntrySuccess("file content");
      expect(openSuccess).toHaveBeenCalledWith("file content");
    });

    it("should call the errorCb if requestFileSystem fails", function () {
      service.open("file", openSuccess, openError);
      window.OnRequestFileSystemError();
      expect(openError).toHaveBeenCalled();
    });

    it("should call the errorCb if can't get the file", function () {
      service.open("file", openSuccess, openError);
      window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnGetFileError();
      expect(openError).toHaveBeenCalled();
    });

    it("should call the errorCb if can't read the file", function () {
      service.open("file", openSuccess, openError);
      window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnGetFileSuccess().OnFileEntryError();
      expect(openError).toHaveBeenCalled();
    });
  });

  describe("save(fileName, data, successCb, errorCb)", function () {

    it("should use the file service", function () {
      spyOn(window, "requestFileSystem");
      service.save("file", {}, openSuccess, openError);
      expect(window.requestFileSystem).toHaveBeenCalled();
    });

    describe("content serialization", function () {

      beforeEach(function () {
        spyOn(writer, 'write');
      });

      it("should serialize the content and add to the file", function () {
        service.save("file", {data: "some-data"}, openSuccess, openError);
        window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnGetFileSuccess().OnWriteSuccess();
        expect(writer.write).toHaveBeenCalledWith('{"data":"some-data"}');
      });

      it("should add a string", function () {
        service.save("file", "data", openSuccess, openError);
        window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnGetFileSuccess().OnWriteSuccess();
        expect(writer.write).toHaveBeenCalledWith('"data"');
      });

      it("should add an integer", function () {
        service.save("file", 123, openSuccess, openError);
        window.OnRequestFileSystemSuccess().OnGetDirectorySuccess().OnGetFileSuccess().OnWriteSuccess();
        expect(writer.write).toHaveBeenCalledWith('123');
      });
    });
  });
});