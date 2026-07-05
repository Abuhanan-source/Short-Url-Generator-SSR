
export const HomeUrlPage = async (req, res) => {
    try {
        res.status(200).render("Homepage")
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}