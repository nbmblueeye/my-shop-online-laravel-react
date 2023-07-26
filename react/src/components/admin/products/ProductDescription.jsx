import React, { useRef, useEffect } from 'react';
import '../../../../ckeditor5/build/ckeditor';

const ProductDescription = ( { name, description, setDescription}) => {

    const ckEditorRef       = useRef(true);
    const descriptionRef    = useRef();

    useEffect(() => {

        if(ckEditorRef.current){

            ClassicEditor
            .create( descriptionRef.current, {
                removePlugins: [
                    "MediaEmbedToolbar", 
                    'Title', 
                    'Markdown',
                ],
                ckfinder: {
                    uploadUrl: `${import.meta.env.VITE_API_BASE_URL}/api/ckfinder/upload?${localStorage.getItem('ACCESS_TOKEN')}`
                },

                image: {
                    resizeOptions: [
                        {
                            name: 'resizeImage:original',
                            value: null,
                            icon: 'original'
                        },
                        {
                            name: 'resizeImage:50',
                            value: '50',
                            icon: 'medium'
                        },
                        {
                            name: 'resizeImage:75',
                            value: '75',
                            icon: 'large'
                        }
                    ],
                    toolbar: [
                        'imageTextAlternative',
                        'toggleImageCaption',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side',
                        'linkImage',
                        'resizeImage:50',
                        'resizeImage:75',
                        'resizeImage:original',
                    ]
                }
            } )
            .then( editor => {

                editor.model.document.on('change', () => {
                    setDescription(editor.getData());
                });

                if(name == 'update_product'){
                    editor.setData(description);
                }

            } )
            .catch( error => {
                console.error( error );
            } );
		
        }

        return () => ckEditorRef.current = false;
    }, [])

return (  
    <>
        <textarea name={name} ref={descriptionRef}></textarea>
    </>
)

}

export default ProductDescription