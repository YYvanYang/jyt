
function initEditor(param) {
	var timestamp = (new Date()).valueOf();
	var token = "";
	var language = "cn";
	var domain = "";
	KindEditor.ready(function(K) {
		var webFilePath = $("input[name='h_webFilePath']").val();
		var webRootPath = $("input[name='h_webRootPath']").val();
		$.getJSON('/UploadApiServlet?t='+timestamp,
			function(data){ 
			debugger
				if(data.uploadToken) {
					token = data.uploadToken;
					language = data.language;
					domain = data.domain;
				    window.editor = K.create(param.el,{
				    	swf: webRootPath+"/static/dep/uploadify/uploadify.swf",
				        resizeType: 1,
				        urlType: 'domain',
				        uploadJson: webFilePath+"/upload.do?action=upload",
				        baseFilePath: webFilePath,
				        imageSizeLimit: "5MB",
				        extraFileUploadParams: {moduleFlag:"report","token":token,"domain":domain,"language":language,"fileType":"image"},
				        allowFlashUpload: false,
				        allowMediaUpload: false,
				        allowFileUpload: false,
				        afterUpload: function(){ 
							$.cookie('JSESSIONID',token);        	
				        }
				    });

				}
		 	}
		);		
	});	
}


