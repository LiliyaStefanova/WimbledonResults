<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="tournament">
        <html>
            <table border="1" cellspacing="0">
                <tr align="left" padding-right="15px">
                    <th>Round</th>
                    <th>Player</th>
                    <th>Set 1</th>
                    <th>Set 2</th>
                    <th>Set 3</th>
                    <th>Set 4</th>
                    <th>Set 5</th>
                </tr>
                <xsl:for-each select="match">

                    <xsl:for-each select=".//player">
                        <tr align="left" padding-right="15px">
                            <td>
                                <xsl:value-of select="../round"/>
                            </td>
                            <xsl:choose>
                                <xsl:when test="outcome='won'">
                                    <td>
                                        <span style="font-weight:bold">
                                            <xsl:value-of select=".//name"/>
                                        </span>
                                    </td>
                                </xsl:when>
                                <xsl:otherwise>
                                    <td>
                                        <xsl:value-of select=".//name"/>
                                    </td>
                                </xsl:otherwise>
                            </xsl:choose>
                            <xsl:for-each select=".//set">
                                <td>
                                    <xsl:if test="position()&lt;5">
                                        <xsl:value-of select="."/>
                                    </xsl:if>
                                </td>
                            </xsl:for-each>
                        </tr>
                    </xsl:for-each>
                </xsl:for-each>
            </table>
        </html>
    </xsl:template>
</xsl:stylesheet>
