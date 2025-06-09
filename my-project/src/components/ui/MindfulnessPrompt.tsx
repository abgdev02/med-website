import { useState, useEffect } from 'react'
import styles from './MindfulnessPrompt.module.css'

const prompts = [
  "Notice your breath flowing naturally",
  "Feel your feet on the ground", 
  "Allow thoughts to pass like clouds",
  "Sense the space around you",
  "Return gently to this moment",
  "Feel the weight of your body",
  "Listen to the sounds around you",
  "Observe without judgment"
]

export function MindfulnessPrompt() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentPrompt(prev => (prev + 1) % prompts.length)
        setIsVisible(true)
      }, 500) // Fade transition
      
    }, 15000) // Change every 15 seconds
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className={`${styles.promptContainer} ${isVisible ? styles.visible : styles.hidden}`}>
      <p className={styles.promptText}>
        {prompts[currentPrompt]}
      </p>
    </div>
  )
}