interface ServerModelProps {
  online: boolean
}

function ServerModel({ online }: ServerModelProps) {
  return (
    <section className="server-model">
      {online ? (
        <svg
          className="server-heart is-online"
          viewBox="0 0 100 100"
          role="img"
          aria-label="Server online"
        >
          <path
            className="heart-shape"
            d="
              M50 88
              C42 80, 12 58, 12 32
              C12 16, 24 8, 36 8
              C44 8, 49 12, 50 18
              C51 12, 56 8, 64 8
              C76 8, 88 16, 88 32
              C88 58, 58 80, 50 88
              Z
            "
          />
        </svg>
      ) : (
        <svg
          className="server-poop"
          viewBox="0 0 100 100"
          role="img"
          aria-label="Server offline"
        >
          <path
            className="poop-shape"
            d="
              M32 78
              C19 78 14 70 17 61
              C19 55 24 51 31 50

              C25 45 26 36 32 32
              C36 29 41 28 46 29

              C43 24 45 17 50 12
              C51 20 58 23 62 28
              C65 31 66 35 65 39

              C73 38 80 43 82 50
              C84 56 81 61 77 64

              C84 67 86 74 82 80
              C79 85 74 88 65 88

              L32 88
              C24 88 20 84 20 79
              C20 78 20 78 20 77

              C23 78 27 78 32 78
              Z
            "
          />

          <circle className="poop-eye" cx="39" cy="57" r="3" />
          <circle className="poop-eye" cx="62" cy="57" r="3" />

          <path
            className="poop-mouth"
            d="M42 72 Q50 66 58 72"
          />
        </svg>
      )}
    </section>
  )
}

export default ServerModel