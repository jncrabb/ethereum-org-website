import React, { useEffect, useMemo, useState } from "react"
import {
  Box,
  Flex,
  Grid,
  Icon,
  ListItem,
  type ListItemProps,
  OrderedList,
  Spinner,
  Text,
  type GridProps,
  ListProps,
} from "@chakra-ui/react"
import type { SimulatorStateProps } from "../../interfaces"
import { EthGlyphIcon, HomeScreen, ProgressCta } from "./"
import { motion } from "framer-motion"
import { WORDLISTS } from "../../data/bip39Words"
import { PiCheckThin } from "react-icons/pi"

const MotionFlex = motion(Flex)
const FadeInFlex = (props) => (
  <MotionFlex initial={{ opacity: 0 }} animate={{ opacity: 1 }} {...props} />
)
const GeneratingKeysComponent: React.FC<SimulatorStateProps> = ({ state }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const { progressStepper } = state

  // Show spinner for 2100ms, switching "loading" state to false when complete
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 2100)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  // After loading is complete, wait another 1600ms before calling progressStepper
  useEffect(() => {
    if (loading) return
    const timeout = setTimeout(progressStepper, 1600)
    return () => {
      clearTimeout(timeout)
    }
  }, [loading])

  const ICON_SIZE = "4.5rem" as const
  return (
    <Grid placeItems="center" h="full" bg="background.highlight">
      <Flex direction="column" alignItems="center" pt={8} gap={4}>
        {loading ? (
          <Spinner w={ICON_SIZE} h={ICON_SIZE} />
        ) : (
          <Icon
            as={PiCheckThin}
            w={ICON_SIZE}
            h={ICON_SIZE}
            transform="rotate(-10deg)"
          />
        )}
        <Text textAlign="center" px={{ base: 4, md: 8 }}>
          {loading ? "Generating your recovery phrase" : "Account created"}
        </Text>
      </Flex>
    </Grid>
  )
}

const generateRandomSeed = (): Array<string> =>
  Array(12)
    .fill(0)
    .map(() => WORDLISTS.en[Math.floor(Math.random() * 2 ** 11)])

const wordStyleVariants = {
  display: {
    borderBottom: "1px",
    borderColor: "body.medium",
    mt: 4,
  },
  active: {},
  inactive: {},
  disabled: {
    borderRadius: "md",
    bg: "body.light",
    color: "body.medium",
    px: 2,
  },
} as const

export type WordStyleVariant = keyof typeof wordStyleVariants
interface WordDisplayProps extends Pick<ListItemProps, "children"> {
  variant: WordStyleVariant
}
const WordDisplay: React.FC<WordDisplayProps> = ({ children, variant }) => (
  <Box {...wordStyleVariants[variant]}>
    <ListItem fontSize="sm" lineHeight={9} mb={0} listStylePos="inside">
      {children}
    </ListItem>
  </Box>
)

interface WordListProps {
  words: Array<string>
  variant: WordStyleVariant
}
const WordList: React.FC<WordListProps> = ({ words, variant = "disabled" }) => {
  const sharedStyles = {
    m: 0,
    display: "flex",
    flexDirection: "column",
    h: "calc(6 * (16px + 37px))",
    columnGap: 8,
  } as const
  const styleVariants = {
    disabled: {
      rowGap: 3,
    },
  } as const
  const variantStyles: GridProps = styleVariants[variant] ?? {}
  const styles = { ...sharedStyles, ...variantStyles } as ListProps
  const splitIndex = Math.floor(words.length / 2)
  return (
    <Grid templateColumns="repeat(2, 1fr)" columnGap={8}>
      <OrderedList {...styles} start={1}>
        {words.slice(0, splitIndex).map((word) => (
          <WordDisplay variant={variant}>{word}</WordDisplay>
        ))}
      </OrderedList>
      <OrderedList {...styles} start={splitIndex + 1}>
        {words.slice(splitIndex).map((word) => (
          <WordDisplay variant={variant}>{word}</WordDisplay>
        ))}
      </OrderedList>
    </Grid>
  )
}

interface WordSelectorProps extends SimulatorStateProps {
  words: Array<string>
}
const InteractiveWordSelector: React.FC<WordSelectorProps> = ({
  state,
  words,
}) => {
  return <WordList words={words} variant="disabled" />
}

const CreateAccountScreens: React.FC<SimulatorStateProps> = ({ state }) => {
  const { step } = state
  const words = useMemo<Array<string>>(generateRandomSeed, [])
  return (
    <>
      {[0, 1].includes(step) && <HomeScreen state={state} />}
      {[2].includes(step) && (
        <FadeInFlex
          direction="column"
          alignItems="center"
          pt={8}
          h="full"
          bg="background.highlight"
        >
          <Icon
            as={EthGlyphIcon}
            color="body.base"
            height="190px"
            w="auto"
            my={4}
          />
          <Text
            fontSize="2xl"
            textAlign="center"
            px={{ base: 4, md: 8 }}
            lineHeight={8}
          >
            Welcome to{" "}
            <Text as="span" fontWeight="bold">
              wallet simulator
            </Text>
          </Text>
        </FadeInFlex>
      )}
      {[3].includes(step) && <GeneratingKeysComponent state={state} />}
      {[4].includes(step) && (
        <Box py={8} px={{ base: 4, md: 8 }} h="full" bg="background.highlight">
          <Text fontSize="2xl" lineHeight={8} fontWeight="bold">
            Recovery phrase
          </Text>
          <Text>Ethereum accounts are controlled by recovery phrase.</Text>
          <Text>
            Any person knowing this secret recovery phrase can make transactions
            on behalf of your account.
          </Text>
          <Text>
            Wallet app providers do not have access to your account—only you do.
          </Text>
        </Box>
      )}
      {[5].includes(step) && (
        <Box my={8} px={{ base: 4, md: 8 }}>
          <Text fontSize="2xl" lineHeight={8} fontWeight="bold">
            Recovery phrase example
          </Text>
          <WordList words={words} variant="display" />
        </Box>
      )}
      {[6].includes(step) && (
        <Box my={8} px={{ base: 4, md: 8 }}>
          <Text fontSize="2xl" lineHeight={8} fontWeight="bold">
            Repeat the words
          </Text>
          <InteractiveWordSelector state={state} words={words} />
        </Box>
      )}
      {[0, 1, 2, 4, 5, 7].includes(step) && <ProgressCta state={state} />}
    </>
  )
}
export const Phone: React.FC<SimulatorStateProps> = ({ state }) => {
  const { pathId } = state

  // TODO: Relocate data: store component name, dynamically load component then pass state
  const screenData = {
    "create-account": <CreateAccountScreens state={state} />,
  }

  const screen = screenData[pathId]
  return (
    <Box as="figure" w="min(100%, 300px)" mx="auto">
      {/* Phone frame */}
      <Box
        h={{ base: 480, md: 600 }}
        maxH="100%"
        w="full"
        border="8px"
        borderColor="body.medium"
        borderRadius="3xl"
        bg="background.base"
        position="relative"
        zIndex={1}
        overflow="hidden"
      >
        {screen}
      </Box>
      {/* Phone drop shadow */}
      <Box
        h={6}
        w="full"
        borderRadius="100%"
        position="relative"
        filter="blur(14px)"
        bg="body.base"
        opacity={0.5}
        zIndex={-1}
      />
    </Box>
  )
}