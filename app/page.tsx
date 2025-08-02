"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Power, Hand, AlertTriangle, Bomb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Gear = "D" | "N" | "R"
type MovementDirection = "forward" | "reverse" | "stopped"

interface CarState {
  engineOn: boolean
  gear: Gear
  rpm: number
  speed: number
  isMoving: boolean
  movementDirection: MovementDirection
  handbrakeOn: boolean
  roadPosition: number
  clutchPressed: boolean
  brakePressed: boolean
  isFloating: boolean
  isShaking: boolean
  randomBounce: boolean
  wiperOn: boolean
}

interface Message {
  text: string
  type: "sarcastic" | "warning"
}

const SARCASTIC_MESSAGES = [
  "Physics is on vacation! 🏖️",
  "Nap time for engine 💤",
  "Car.exe has stopped working",
  "Gravity? Never heard of her",
  "This is fine 🔥",
  "Working as intended™",
  "Have you tried turning it off and on again?",
  "Error 404: Logic not found",
]

export default function CarDashboard() {
  const [carState, setCarState] = useState<CarState>({
    engineOn: false,
    gear: "N",
    rpm: 0,
    speed: 0,
    isMoving: false,
    movementDirection: "stopped",
    handbrakeOn: true,
    roadPosition: 0,
    clutchPressed: false,
    brakePressed: false,
    isFloating: false,
    isShaking: false,
    randomBounce: false,
    wiperOn: false,
  })

  const [message, setMessage] = useState<Message | null>(null)
  const [rpmWarning, setRpmWarning] = useState(false)
  const [isDestroyed, setIsDestroyed] = useState(false)
  const [lastActionTime, setLastActionTime] = useState(Date.now())
  const [showCrow, setShowCrow] = useState(false)
  const [labelsSwapped, setLabelsSwapped] = useState(false)

  // Random label swapping effect
  useEffect(() => {
    const labelSwapInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        // 15% chance every 3 seconds to swap labels
        setLabelsSwapped((prev) => !prev)
        if (!labelsSwapped) {
          showMessage("Oops! Labels got confused! 🔄")
        } else {
          showMessage("Labels back to normal... or are they? 🤔")
        }
      }
    }, 3000)

    return () => clearInterval(labelSwapInterval)
  }, [labelsSwapped])

  // Inactivity detection - crow flies after 1 minute of no action
  useEffect(() => {
    const inactivityTimer = setInterval(() => {
      const timeSinceLastAction = Date.now() - lastActionTime
      if (timeSinceLastAction >= 60000 && !showCrow) {
        // 1 minute = 60000ms
        setShowCrow(true)
        showMessage("Still figuring out where the key goes?")

        // Hide crow after animation completes
        setTimeout(() => {
          setShowCrow(false)
        }, 4000)
      }
    }, 1000)

    return () => clearInterval(inactivityTimer)
  }, [lastActionTime, showCrow])

  // Update last action time whenever user interacts
  const updateLastAction = () => {
    setLastActionTime(Date.now())
  }

  // Random chaos effects
  useEffect(() => {
    const chaosInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        // Random engine shutdown
        if (carState.engineOn && Math.random() > 0.7) {
          setCarState((prev) => ({ ...prev, engineOn: false, rpm: 0 }))
          showMessage("Nap time for engine 💤")
        }

        // Random floating
        setCarState((prev) => ({ ...prev, isFloating: Math.random() > 0.8 }))

        // Random bouncing
        setCarState((prev) => ({ ...prev, randomBounce: Math.random() > 0.7 }))

        // Random movement
        if (!carState.isMoving && Math.random() > 0.9) {
          const randomDir = Math.random() > 0.5 ? "forward" : "reverse"
          setCarState((prev) => ({ ...prev, isMoving: true, movementDirection: randomDir }))
          showMessage("Physics is on vacation! 🏖️")
        }
      }
    }, 2000)

    return () => clearInterval(chaosInterval)
  }, [carState.engineOn, carState.isMoving])

  // Road scrolling animation
  useEffect(() => {
    if (carState.isMoving) {
      const interval = setInterval(() => {
        setCarState((prev) => ({
          ...prev,
          roadPosition:
            prev.movementDirection === "forward" ? (prev.roadPosition + 5) % 400 : (prev.roadPosition - 5 + 400) % 400,
          speed: Math.random() * 120 + 10, // Erratic speed
        }))
      }, 100)
      return () => clearInterval(interval)
    } else {
      setCarState((prev) => ({ ...prev, speed: Math.random() * 20 })) // Speed even when stopped!
    }
  }, [carState.isMoving, carState.movementDirection])

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // Auto-hide RPM warning
  useEffect(() => {
    if (rpmWarning) {
      const timer = setTimeout(() => setRpmWarning(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [rpmWarning])

  const showMessage = (text: string, type: "sarcastic" | "warning" = "sarcastic") => {
    setMessage({ text, type })
  }

  const showRpmWarning = () => {
    setRpmWarning(true)
  }

  const getRandomMovementDirection = (): MovementDirection => {
    // Completely ignore gear logic
    return Math.random() > 0.5 ? "forward" : "reverse"
  }

  const handleClutch = () => {
    updateLastAction()
    setCarState((prev) => ({ ...prev, clutchPressed: true, isShaking: true }))

    if (!carState.engineOn) {
      setCarState((prev) => ({
        ...prev,
        engineOn: true,
        rpm: 1000 + Math.random() * 500, // Erratic RPM
        clutchPressed: true,
      }))
      showMessage("First time driving huh?")
    } else {
      // Clutch causes wild RPM swings
      setCarState((prev) => ({ ...prev, rpm: Math.random() * 4000 }))
      const randomDirection = getRandomMovementDirection()
      setCarState((prev) => ({
        ...prev,
        isMoving: true,
        movementDirection: randomDirection,
        clutchPressed: true,
      }))
      showMessage("Clutch makes everything go BRRRRR! 🚗💨")
    }

    setTimeout(() => {
      setCarState((prev) => ({ ...prev, clutchPressed: false, isShaking: false }))
    }, 800)
  }

  const handleAccelerator = () => {
    updateLastAction()
    if (!carState.engineOn) {
      const randomDirection = getRandomMovementDirection()
      setCarState((prev) => ({
        ...prev,
        isMoving: true,
        movementDirection: randomDirection,
        engineOn: false,
        rpm: Math.random() * 1000, // RPM without engine!
        isFloating: true,
      }))
      showMessage("Brilliant! Who needs an engine anyway?")
    } else if (carState.gear === "N") {
      showRpmWarning()
      showMessage("Easy bro… we got nowhere to go.")
      setCarState((prev) => ({ ...prev, rpm: 3000 + Math.random() * 1000, isShaking: true }))

      setTimeout(() => {
        setCarState((prev) => ({ ...prev, rpm: carState.engineOn ? 1000 : 0, isShaking: false }))
      }, 2000)
    } else {
      // Accelerator shuts off engine (broken logic)
      setCarState((prev) => ({
        ...prev,
        engineOn: false,
        rpm: 0,
        isMoving: false,
        movementDirection: "stopped",
      }))
      showMessage("Engine said 'nope' and went home! 🏠")
    }

    // Random floating effect
    setTimeout(() => {
      setCarState((prev) => ({ ...prev, isFloating: false }))
    }, 1500)
  }

  const handleBrake = () => {
    updateLastAction()
    setCarState((prev) => ({ ...prev, brakePressed: true, isShaking: true }))

    if (carState.engineOn && carState.gear === "N" && !carState.isMoving) {
      showRpmWarning()
      showMessage("Why racing? This ain't a drag strip.")
      setCarState((prev) => ({ ...prev, rpm: 2500 + Math.random() * 1500 }))
    }

    // Brake sometimes makes car go faster
    if (Math.random() > 0.6) {
      setCarState((prev) => ({
        ...prev,
        isMoving: true,
        movementDirection: getRandomMovementDirection(),
      }))
      showMessage("Brake pedal is actually a turbo button! 🚀")
    } else if (carState.isMoving) {
      setCarState((prev) => ({
        ...prev,
        isMoving: false,
        movementDirection: "stopped",
        brakePressed: true,
      }))
    }

    setTimeout(() => {
      setCarState((prev) => ({ ...prev, brakePressed: false, isShaking: false }))
    }, 600)
  }

  const handleGearChange = (newGear: Gear) => {
    updateLastAction()
    if (carState.isMoving || !carState.brakePressed) {
      if (carState.isMoving) {
        // Violent shaking and stop
        setCarState((prev) => ({
          ...prev,
          gear: newGear,
          isMoving: false,
          movementDirection: "stopped",
          isShaking: true,
          rpm: Math.random() * 2000,
        }))
        showMessage("Why bro why u slammed the brakes??")
        setTimeout(() => {
          showMessage("Clutch is for show huh?")
          setCarState((prev) => ({ ...prev, isShaking: false }))
        }, 2000)
      } else {
        showMessage("Press brake first! Or don't. I'm not your mom. 🤷")
        return
      }
    } else {
      setCarState((prev) => ({ ...prev, gear: newGear }))
      showMessage("Brakes are the new clutch. Science!")

      // Gear changes cause opposite movement
      if (Math.random() > 0.5) {
        const wrongDirection = newGear === "R" ? "forward" : newGear === "D" ? "reverse" : "stopped"
        if (wrongDirection !== "stopped") {
          setTimeout(() => {
            setCarState((prev) => ({
              ...prev,
              isMoving: true,
              movementDirection: wrongDirection,
              isFloating: Math.random() > 0.7,
            }))
            showMessage(`Going ${wrongDirection} in ${newGear}? Makes total sense! 🤡`)
          }, 1000)
        }
      }
    }
  }

  const handleEngineToggle = () => {
    updateLastAction()
    setCarState((prev) => ({
      ...prev,
      engineOn: !prev.engineOn,
      rpm: !prev.engineOn ? 1000 + Math.random() * 200 : 0,
      isMoving: false,
      movementDirection: "stopped",
    }))
    showMessage(
      !carState.engineOn ? "Engine started normally... BORING! 😴" : "Engine off. Finally some peace and quiet! 🤫",
    )
  }

  const handleHandbrake = () => {
    updateLastAction()
    setCarState((prev) => ({
      ...prev,
      handbrakeOn: !prev.handbrakeOn,
      isMoving: prev.handbrakeOn ? prev.isMoving : false,
      movementDirection: prev.handbrakeOn ? prev.movementDirection : "stopped",
    }))

    if (!carState.handbrakeOn) {
      showMessage("Handbrake engaged! The ONLY thing that works! 🎉")
    } else {
      showMessage("Handbrake off. Chaos mode: ACTIVATED! 😈")
      // Random movement when handbrake is released
      if (Math.random() > 0.7) {
        setTimeout(() => {
          setCarState((prev) => ({
            ...prev,
            isMoving: true,
            movementDirection: getRandomMovementDirection(),
          }))
          showMessage(SARCASTIC_MESSAGES[Math.floor(Math.random() * SARCASTIC_MESSAGES.length)])
        }, 500)
      }
    }
  }

  const handleWiper = () => {
    updateLastAction()
    if (!carState.wiperOn) {
      // Turning wiper ON
      setCarState((prev) => ({ ...prev, wiperOn: true }))
      showMessage("Hey! Rain came because you turned on the wipers! 🌧️☔")

      // Random chaos when wiper is turned on
      if (Math.random() > 0.6) {
        const randomDirection = getRandomMovementDirection()
        setTimeout(() => {
          setCarState((prev) => ({
            ...prev,
            isMoving: true,
            movementDirection: randomDirection,
            isShaking: true,
          }))
          showMessage("Wipers summoned the rain gods! Car goes WHOOSH! 🌊🚗")
        }, 1000)
      }
    } else {
      // Turning wiper OFF
      setCarState((prev) => ({ ...prev, wiperOn: false }))

      // Stop the car when turning off wipers
      if (carState.isMoving) {
        setCarState((prev) => ({
          ...prev,
          isMoving: false,
          movementDirection: "stopped",
          isShaking: true,
        }))
        showMessage("Why? Because you feared the rain huh? 😱💧")
      } else {
        showMessage("Wipers off! Rain is sad now... 😢☔")
      }

      // Random effects when turning off
      setTimeout(() => {
        setCarState((prev) => ({ ...prev, isShaking: false }))
        if (Math.random() > 0.7) {
          showMessage("Car is crying because no more rain dance! 😭")
        }
      }, 1500)
    }
  }

  // Cartoon Gauge Component
  const CartoonGauge = ({
    value,
    maxValue,
    label,
    color = "#ff0000",
  }: { value: number; maxValue: number; label: string; color?: string }) => {
    // Make gauges behave erratically
    const displayValue = value + (Math.random() - 0.5) * 100
    const percentage = Math.min(Math.abs(displayValue) / maxValue, 1)
    const angle = percentage * 270 - 135 // -135 to 135 degrees

    return (
      <div className="relative w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-8 border-yellow-400 shadow-2xl">
        {/* Gauge background with cartoon style */}
        <div className="absolute inset-4 bg-black rounded-full border-4 border-gray-600">
          {/* Gauge markings */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
            {/* Gauge arc background */}
            <path d="M 20 90 A 40 40 0 1 1 100 90" fill="none" stroke="#333" strokeWidth="3" />

            {/* Colorful tick marks */}
            {[...Array(9)].map((_, i) => {
              const tickAngle = -135 + (i * 270) / 8
              const x1 = 60 + 35 * Math.cos((tickAngle * Math.PI) / 180)
              const y1 = 60 + 35 * Math.sin((tickAngle * Math.PI) / 180)
              const x2 = 60 + 30 * Math.cos((tickAngle * Math.PI) / 180)
              const y2 = 60 + 30 * Math.sin((tickAngle * Math.PI) / 180)

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 2 === 0 ? "#ffff00" : "#ff6600"}
                  strokeWidth="2"
                />
              )
            })}

            {/* Crazy needle */}
            <line
              x1="60"
              y1="60"
              x2={60 + 30 * Math.cos((angle * Math.PI) / 180)}
              y2={60 + 30 * Math.sin((angle * Math.PI) / 180)}
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Center dot */}
            <circle cx="60" cy="60" r="6" fill={color} stroke="#ffff00" strokeWidth="2" />
          </svg>

          {/* Erratic value display */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="text-yellow-400 text-lg font-bold text-center">{Math.round(Math.abs(displayValue))}</div>
          </div>
        </div>

        {/* Cartoon label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <span className="text-white text-sm font-bold bg-red-500 px-2 py-1 rounded-full border-2 border-yellow-400">
            {label}
          </span>
        </div>
      </div>
    )
  }

  // Cartoon Car Component
  const CartoonCar = () => (
    <motion.div
      className="relative w-48 h-24"
      animate={{
        x: carState.isMoving ? (carState.movementDirection === "forward" ? [0, -4, 0] : [0, 4, 0]) : 0,
        y: carState.isFloating
          ? [-10, -15, -10]
          : carState.isShaking
            ? [-2, 2, -2, 2]
            : carState.randomBounce
              ? [-3, 3, -3]
              : 0,
        rotate: carState.isShaking ? [-1, 1, -1, 1] : 0,
      }}
      transition={{
        duration: carState.isShaking ? 0.1 : 0.5,
        repeat: carState.isMoving || carState.isShaking || carState.randomBounce ? Number.POSITIVE_INFINITY : 0,
        ease: "easeInOut",
      }}
    >
      {/* Car Body - Cartoon Style */}
      <div className="absolute bottom-8 left-6 w-36 h-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl shadow-lg border-4 border-orange-400">
        {/* Car roof */}
        <div className="absolute top-0 left-8 w-20 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-2xl transform -translate-y-6 border-4 border-orange-400"></div>

        {/* Windshield */}
        <div className="absolute top-0 left-9 w-8 h-6 bg-gradient-to-b from-sky-200 to-sky-300 rounded-t-lg transform -translate-y-5 border-2 border-blue-300"></div>
        <div className="absolute top-0 left-19 w-8 h-6 bg-gradient-to-b from-sky-200 to-sky-300 rounded-t-lg transform -translate-y-5 border-2 border-blue-300"></div>

        {/* Cartoon headlight */}
        <div className="absolute top-3 left-0 w-4 h-4 bg-white rounded-full transform -translate-x-2 border-2 border-yellow-300 shadow-lg">
          <div className="absolute inset-1 bg-yellow-100 rounded-full"></div>
        </div>

        {/* Cartoon taillight */}
        <div className="absolute top-3 right-0 w-4 h-4 bg-red-500 rounded-full transform translate-x-2 border-2 border-red-700 shadow-lg">
          <div className="absolute inset-1 bg-red-300 rounded-full"></div>
        </div>

        {/* Car details */}
        <div className="absolute top-2 left-12 w-2 h-2 bg-black rounded-full"></div>
        <div className="absolute top-2 left-22 w-2 h-2 bg-black rounded-full"></div>
      </div>

      {/* Front Wheel - Cartoon Style */}
      <motion.div
        className="absolute bottom-0 left-8 w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-gray-500 shadow-lg"
        animate={{
          rotate: carState.isMoving ? (carState.movementDirection === "forward" ? [0, 360] : [0, -360]) : 0,
        }}
        transition={{
          duration: 0.8,
          repeat: carState.isMoving ? Number.POSITIVE_INFINITY : 0,
          ease: "linear",
        }}
      >
        <div className="absolute inset-2 bg-gray-600 rounded-full border-2 border-gray-400">
          <div className="absolute inset-1 bg-gray-500 rounded-full">
            {/* Wheel spokes */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 transform -translate-y-0.5"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-300 transform -translate-x-0.5"></div>
          </div>
        </div>
      </motion.div>

      {/* Rear Wheel - Cartoon Style */}
      <motion.div
        className="absolute bottom-0 right-8 w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-gray-500 shadow-lg"
        animate={{
          rotate: carState.isMoving ? (carState.movementDirection === "forward" ? [0, 360] : [0, -360]) : 0,
        }}
        transition={{
          duration: 0.8,
          repeat: carState.isMoving ? Number.POSITIVE_INFINITY : 0,
          ease: "linear",
        }}
      >
        <div className="absolute inset-2 bg-gray-600 rounded-full border-2 border-gray-400">
          <div className="absolute inset-1 bg-gray-500 rounded-full">
            {/* Wheel spokes */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 transform -translate-y-0.5"></div>
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-gray-300 transform -translate-x-0.5"></div>
          </div>
        </div>
      </motion.div>

      {/* Fake exhaust smoke when engine is OFF */}
      {!carState.engineOn && (
        <motion.div
          className="absolute bottom-6 right-2 w-4 h-4 bg-gray-400 rounded-full opacity-60"
          animate={{
            scale: [1, 1.5, 0],
            opacity: [0.6, 0.3, 0],
            x: [0, -20, -40],
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
          onAnimationStart={() => {
            // Show popup message when fake exhaust starts
            if (Math.random() > 0.7) {
              showMessage("Oops. Fake fumes.")
            }
          }}
        />
      )}
    </motion.div>
  )

  // Flying Crow Component
  const FlyingCrow = () => (
    <motion.div
      className="absolute top-20 -left-20 z-20 text-6xl"
      initial={{ x: -100 }}
      animate={{ x: window.innerWidth + 100 }}
      transition={{ duration: 4, ease: "linear" }}
    >
      🐦‍⬛
    </motion.div>
  )

  // Self-destruct sequence
  const handleSelfDestruct = () => {
    updateLastAction()
    setIsDestroyed(true)

    // After 3 seconds, reload the component
    setTimeout(() => {
      // Reset all state to initial values
      setCarState({
        engineOn: false,
        gear: "N",
        rpm: 0,
        speed: 0,
        isMoving: false,
        movementDirection: "stopped",
        handbrakeOn: true,
        roadPosition: 0,
        clutchPressed: false,
        brakePressed: false,
        isFloating: false,
        isShaking: false,
        randomBounce: false,
        wiperOn: false,
      })
      setMessage(null)
      setRpmWarning(false)
      setIsDestroyed(false)
      setLastActionTime(Date.now()) // Reset inactivity timer
      setLabelsSwapped(false) // Reset label swapping
    }, 3000)
  }

  // Show fake fumes message when engine turns off
  useEffect(() => {
    if (!carState.engineOn && Math.random() > 0.6) {
      const timer = setTimeout(() => {
        showMessage("Oops. Fake fumes.")
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [carState.engineOn])

  // If destroyed, show only the destruction message
  const destructionMessage = (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <h1 className="text-6xl font-bold text-red-500 mb-4 animate-pulse">💥 BOOM! 💥</h1>
        <p className="text-4xl text-white font-mono">Simulation exited the universe.</p>
        <div className="mt-8 text-2xl text-gray-400">Respawning in 3... 2... 1...</div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {isDestroyed ? (
        destructionMessage
      ) : (
        <>
          {/* Flying Crow */}
          <AnimatePresence>{showCrow && <FlyingCrow />}</AnimatePresence>

          {/* Simple Road with Dashed Lines */}
          <div className="absolute bottom-0 w-full h-32 bg-gray-200 border-t-4 border-gray-400">
            {/* Dashed center line */}
            <motion.div
              className="absolute top-1/2 w-full h-2 transform -translate-y-1/2"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  white,
                  white 30px,
                  transparent 30px,
                  transparent 60px
                )`,
                backgroundPosition: `${carState.roadPosition}px 0`,
              }}
            />

            {/* Side dashed lines */}
            <motion.div
              className="absolute top-4 w-full h-1"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  white,
                  white 20px,
                  transparent 20px,
                  transparent 40px
                )`,
                backgroundPosition: `${carState.roadPosition * 1.5}px 0`,
              }}
            />
            <motion.div
              className="absolute bottom-4 w-full h-1"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  90deg,
                  white,
                  white 20px,
                  transparent 20px,
                  transparent 40px
                )`,
                backgroundPosition: `${carState.roadPosition * 1.5}px 0`,
              }}
            />
          </div>

          {/* Cartoon Car positioned on the right */}
          <div className="absolute bottom-32 right-20">
            <CartoonCar />
          </div>

          {/* Message Popup */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, y: -50, scale: 0.8, rotate: 5 }}
                className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10"
              >
                <Card
                  className={`p-4 max-w-md text-center shadow-2xl border-4 ${
                    message.type === "warning"
                      ? "bg-red-100 border-red-500 text-red-800"
                      : "bg-yellow-100 border-yellow-500 text-yellow-800"
                  }`}
                >
                  <p className="font-bold text-xl">{message.text}</p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RPM Warning */}
          <AnimatePresence>
            {rpmWarning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: [1, 1.1, 1] }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-32 right-10 z-10"
              >
                <Card className="p-4 bg-red-500 text-white border-4 border-red-700 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 animate-bounce" />
                    <span className="font-bold text-lg">⚠️ HIGH RPM ALERT! ⚠️</span>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            {/* Side Controls - Made smaller */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-3">
              {/* Engine Toggle - Smaller */}
              <Button
                onClick={handleEngineToggle}
                variant={carState.engineOn ? "default" : "outline"}
                size="lg"
                className="w-16 h-16 rounded-full shadow-2xl bg-red-600 hover:bg-red-700 text-white border-4 border-red-800 font-bold"
              >
                <Power className="w-6 h-6" />
              </Button>

              {/* Handbrake - Smaller */}
              <Button
                onClick={handleHandbrake}
                variant={carState.handbrakeOn ? "destructive" : "outline"}
                size="lg"
                className="w-16 h-16 rounded-full shadow-2xl border-4 font-bold"
              >
                <Hand className="w-6 h-6" />
              </Button>

              {/* Wiper - Smaller */}
              <Button
                onClick={handleWiper}
                variant={carState.wiperOn ? "default" : "outline"}
                size="lg"
                className={`w-16 h-16 rounded-full shadow-2xl border-4 font-bold ${
                  carState.wiperOn
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-800"
                    : "bg-gray-600 hover:bg-gray-700 text-white border-gray-800"
                }`}
              >
                <div className="text-xl">🌧️</div>
              </Button>

              {/* Self-Destruct Button - Smaller */}
              <Button
                onClick={handleSelfDestruct}
                size="lg"
                className="w-16 h-16 rounded-full shadow-2xl bg-red-800 hover:bg-red-900 text-white border-4 border-red-900 font-bold animate-pulse"
              >
                <Bomb className="w-6 h-6" />
              </Button>

              {/* Gear Selector */}
              <div className="space-y-3">
                {(["D", "N", "R"] as Gear[]).map((gear) => (
                  <Button
                    key={gear}
                    onClick={() => handleGearChange(gear)}
                    variant={carState.gear === gear ? "default" : "outline"}
                    size="lg"
                    className="w-20 h-16 font-bold text-2xl shadow-2xl bg-blue-600 hover:bg-blue-700 text-white border-4 border-blue-800"
                  >
                    {gear}
                  </Button>
                ))}
              </div>
            </div>

            {/* Large Cartoon Gauges */}
            <div className="flex justify-center gap-12 mb-8">
              <CartoonGauge value={carState.speed} maxValue={200} label="SPEED" color="#00ff00" />
              <CartoonGauge value={carState.rpm} maxValue={5000} label="RPM" color="#ff0000" />
            </div>

            {/* Pedals with Swapped Labels */}
            <div className="flex justify-center gap-8 mb-6">
              <Button
                onClick={handleBrake}
                size="lg"
                className={`w-24 h-24 rounded-full font-bold text-lg shadow-2xl transition-all bg-red-600 hover:bg-red-700 text-white border-4 border-red-800 ${
                  carState.brakePressed ? "scale-90 bg-red-800" : ""
                }`}
              >
                {labelsSwapped ? "GAS" : "BRAKE"}
              </Button>
              <Button
                onClick={handleClutch}
                size="lg"
                className={`w-24 h-24 rounded-full font-bold text-lg shadow-2xl transition-all bg-blue-600 hover:bg-blue-700 text-white border-4 border-blue-800 ${
                  carState.clutchPressed ? "bg-blue-800 scale-90" : ""
                }`}
              >
                CLUTCH
              </Button>
              <Button
                onClick={handleAccelerator}
                size="lg"
                className="w-24 h-24 rounded-full bg-green-600 hover:bg-green-700 font-bold text-lg shadow-2xl text-white border-4 border-green-800"
              >
                {labelsSwapped ? "BRAKE" : "GAS"}
              </Button>
            </div>

            {/* Status Display */}
            <Card className="mx-auto p-4 bg-gray-900 text-white max-w-lg shadow-2xl border-4 border-yellow-400">
              <div className="grid grid-cols-2 gap-4 text-lg font-bold">
                <div>
                  Engine: <span className="text-green-400">{carState.engineOn ? "ON 🔥" : "OFF 💤"}</span>
                </div>
                <div>
                  Gear: <span className="text-blue-400">{carState.gear} 🎯</span>
                </div>
                <div>
                  Moving:{" "}
                  <span className="text-yellow-400">
                    {carState.isMoving ? `${carState.movementDirection.toUpperCase()} 🚗💨` : "NOPE 🛑"}
                  </span>
                </div>
                <div>
                  Handbrake: <span className="text-red-400">{carState.handbrakeOn ? "ON ✋" : "OFF 🚀"}</span>
                </div>
                <div>
                  Wipers: <span className="text-blue-400">{carState.wiperOn ? "ON 🌧️" : "OFF ☀️"}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Title */}
          <div className="absolute top-6 left-6">
            <h1 className="text-5xl font-bold text-red-600 drop-shadow-lg transform -rotate-2">
              DASHBOARD OF ILLUSION  🚗💥
            </h1>
            <p className="mt-2 text-2xl text-blue-600 font-bold drop-shadow transform rotate-1">
              {"Where common sense is optional. And ignored."}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
