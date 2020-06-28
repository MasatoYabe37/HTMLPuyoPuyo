class Random
{
    constructor(seed = 9872314)
    {
        this.seed = seed;
        this.x = 123456789;
        this.y = 36243609;
        this.z = 51288629;
        this.w = 88675123;
    }

    Init(seed = 9872314)
    {
        this.seed = seed;
        this.x = 123456789;
        this.y = 36243609;
        this.z = 51288629;
        this.w = seed;
    }

    Next()
    {
        var t = this.x ^ (this.x << 11);
        this.x = this.y;
        this.y = this.z;
        this.z = this.w;
        this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ t >>> 8)
        return this.w
    }
}