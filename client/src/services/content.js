import { db, storage, firebaseIsConfigured } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const CONTENT_COLLECTION = 'content'
const CONTENT_DOC_ID = 'site'

export async function getSiteContent() {
  if (!firebaseIsConfigured) return null
  const refDoc = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID)
  const snap = await getDoc(refDoc)
  return snap.exists() ? snap.data() : null
}

export async function setSiteContent(partial) {
  if (!firebaseIsConfigured) throw new Error('Firebase not configured')
  const refDoc = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID)
  await setDoc(refDoc, partial, { merge: true })
}

export async function uploadImage(file, prefix = 'images') {
  if (!firebaseIsConfigured) throw new Error('Firebase not configured')
  const name = `${Date.now()}-${file.name}`
  const storageRef = ref(storage, `${prefix}/${name}`)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return { url, storagePath: storageRef.fullPath }
}

export async function deleteImage(storagePath) {
  if (!firebaseIsConfigured || !storagePath) return
  const storageRef = ref(storage, storagePath)
  await deleteObject(storageRef)
}


