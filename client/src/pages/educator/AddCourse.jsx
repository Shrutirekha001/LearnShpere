import React, { useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'

const AddCourse = () => {

  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({

    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  });

  const handleChapter = (action, chapterId)=>{
    if (action === 'add') {
      const title = prompt('Enter chapter Name:');
      if(title){
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    }else if(action === 'remove'){
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    }else if(action === 'toggle'){
      setChapters(
        chapters.map((chapter)=>
        chapter.chapterId === chapterId ? {...chapter, collapsed: !chapter.collapsed} : chapter)
      );
    }
  };


  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    }else if(action === 'remove'){
      setChapters(chapters.map((chapter) =>{
        if(chapter.chapterId === chapterId){
          chapter.chapterContent.splice(lectureIndex, 1);
        }
        return chapter;

      }));
    }
    
  };

   const addLecture = ()=>{
    setChapters(
      chapters.map((chapter) => {
        if(chapter.chapterId === currentChapterId){
          const newLecture = {
            ...lectureDetails,
            lectureOrder : chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    });
   };

   const handleSubmit = async (e)=>{

    e.preventDefault()
   };


 useEffect(()=>{
  // Initialize Quill only once
  if(!quillRef.current && editorRef.current){
    quillRef.current = new Quill(editorRef.current,{
      theme: 'snow',
    });
  }
 }, [])




  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-gradient-to-b from-purple-50 via-white to-white'>
      
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-4 max-w-md w-full text-gray-600'>
        <h2 className='text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text mb-4'>Add New Course</h2>
        
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input onChange={e=>setCourseTitle(e.target.value)} value={courseTitle} type="text"  placeholder='Type here' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/20' required/>

        </div>
        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

         <div className='flex items-center justify-between flex-warp'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input onChange={e=>setCoursePrice(e.target.value)} value={coursePrice} type="number" placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500/20' required />

          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor="thubnailImage" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt=""  className='p-3 bg-gradient-to-r from-blue-400 to-purple-400 '/>
              <input type="file" id='thubnailImage' onChange={e=>setImage(e.target.files[0])} accept='image/*' hidden/>
              <img className='max-h-10' src={image ? URL.createObjectURL(image) : ''} alt="" />
            </label>

          </div>

         </div>

         <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input onChange={e=>setDiscount(e.target.value)} value={discount} type="number"  placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500/20' required/>

         </div>

         {/* Adding chapters & lectures */}

         <div>
          {chapters.map((chapter, ChapterIndex) => (
            <div key={ChapterIndex} className='bg-white border rounded-lg mb-4 border-gray-500/20'>
               <div className='flex justify-between items-center p-4 border-b border-gray-500/20'>
                <div className='flex items-center'>
                    <img onClick={()=> handleChapter('toggle', chapter.chapterId)}
                     src={assets.dropdown_icon} width={14}alt="" className={`mr-2 cursor pointer transition-all ${chapter.collapsed && "-rotate-90"}`}/>
                    <span className='font-semibold'>{ChapterIndex +1} {chapter.chapterTitle}</span>
                </div>

                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img onClick={()=> handleChapter('remove', chapter.chapterId)} 
                src={assets.cross_icon} alt=""  className='cursor-pointer' />
               </div>
               {!chapter.collapsed && (
                 <div className='p-4'>
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className='flex justify-between items-center mb-2'>
                        <span>{lectureIndex +1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target='_blank' className='text-purple-500'>Link</a> - {lecture.isPreviewFree ? "Free Preview" : "Paid"}</span>

                        <img src={assets.cross_icon} alt=""       onClick={()=> handleLecture('remove', chapter.chapterId, lectureIndex)} className='cursor-pointer'/>
                      </div>
                    ))}

                    <div className='inline-flex bg-purple-50 text-purple-600 p-2 rounded-md cursor-pointer mt-2 hover:bg-purple-100 transition-colors' onClick={()=> handleLecture('add', chapter.chapterId)}>+ Add Lecture</div>
                 </div>
               )}
            </div>
          ))}
          
          <div className='flex justify-center items-center bg-purple-100 p-2 rounded-lg cursor-pointer' onClick={()=> handleChapter('add')}>
            + Add Chapter
          </div>

          {showPopup &&(
            <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
              <div className='bg-white text-gray-700 p-6 rounded-lg relative w-full max-w-md mx-4'>
                <h2 className='text-xl font-semibold mb-4'>Add Lecture</h2>
                  
                  <div className='mb-4'>
                    <p className='mb-1 font-medium'>Lecture Title</p>
                    <input type="text" 
                    className='w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={lectureDetails.lectureTitle}
                    onChange={(e)=> setLectureDetails({...lectureDetails, lectureTitle: e.target.value})}/>
                  </div>

                  <div className='mb-4'>
                    <p className='mb-1 font-medium'>Duration (minutes)</p>
                    <input type="number" 
                    className='w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={lectureDetails.lectureDuration}
                    onChange={(e)=> setLectureDetails({...lectureDetails, lectureDuration: e.target.value})}/>
                  </div>

                  <div className='mb-4'>
                    <p className='mb-1 font-medium'>Lecture URL</p>
                    <input type="text" 
                    className='w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={lectureDetails.lectureUrl}
                    onChange={(e)=> setLectureDetails({...lectureDetails, lectureUrl: e.target.value})}/>
                  </div>

                  <div className='flex items-center gap-2 mb-6'>
                    <input type="checkbox" 
                    className='w-4 h-4 text-purple-500 focus:ring-purple-500'
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e)=> setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})}/>
                    <p className='font-medium'>Is Preview Free</p>
                  </div>

                  <button type='button' className='w-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 hover:shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_12px_rgba(59,130,246,0.3)] transition-all duration-300  text-white rounded px-4 py-2' onClick={addLecture}>Add</button>
                 
                 <img  onClick={()=> setShowPopup(false)} src={assets.cross_icon} alt=""  className='absolute top-4 right-4 w-4 cursor-pointer'/>

              </div>

            </div>
          )

          }

         </div>

         <button type='Submit' className='bg-black text-white w-max py-2.5 px-8 rounded my-4'>
          ADD
         </button>

      </form>
    </div>
  )
}

export default AddCourse
